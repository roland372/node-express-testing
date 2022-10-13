import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'; // parse incoming request bodies
import mongoose from 'mongoose';
const cors = require('cors');
import dotenv from 'dotenv';
dotenv.config();
const session = require('express-session');

import booksRoutes from './routes/books';
import authRoute from './routes/auth';
const verify = require('./routes/verifyToken');

const bookSchema = require('./models/book');
import paginatedResults from './utils/pagination';

let cookieParser = require('cookie-parser');

const app = express(); // initialize express application
const PORT = 5000;

declare var process: {
	env: {
		MONGO_URI: string;
	};
};

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', err => console.log(err));
db.on('open', () => console.log('connected to DB'));

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
	session({
		secret: process.env.MONGO_URI,
		resave: false,
		saveUninitialized: true,
	})
);

// routes
app.use('/user', authRoute);
app.use('/books', verify, booksRoutes);
// app.use('/books', verify, paginatedResults(bookSchema), booksRoutes);

app.get('/', (req: Request, res: Response) => {
	console.log('homepage');
	res.status(200).send('Home Page');
});

app.listen(PORT, () => {
	console.log(`server is running on port http://localhost:${PORT}/`);
});
