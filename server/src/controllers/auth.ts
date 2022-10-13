import { Request, Response } from 'express';
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

import { ILogin, IRegister } from '../types/validation';

//* validation
import { loginValidation, registerValidation } from '../utils/validation';
let session = require('express-session');
let cookieParser = require('cookie-parser');

export const registerUser = async (req: Request<IRegister>, res: Response) => {
	// validate data before sending it to db
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// check if user already in database
	const emailExists = await User.findOne({ email: req.body.email });
	if (emailExists) return res.status(400).send('email already in use');

	// hash password
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	// create new user
	const user: IRegister = new User({
		username: req.body.username,
		email: req.body.email,
		// password: req.body.password,
		password: hashedPassword,
	});
	try {
		const savedUser = await user.save();
		res.send(savedUser);
		// res.send({ user: user.username });
	} catch (err) {
		res.status(400).send(err);
	}
};

// let redis = require('redis');
// let JWTR = require('jwt-redis').default;
// let client = redis.createClient({
// 	url: 'redis://redis:6379',
// 	legacyMode: true,
// });
// let jwtr = new JWTR(client);
// const secret = process.env.TOKEN_SECRET;
// const tokenIdentifier = 'test';
// const payload = { jti: tokenIdentifier };

export const loginUser = async (req: Request<ILogin> | any, res: Response) => {
	// validation
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// check if email exists
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send('email or password wrong');

	// if password is correct
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send('email or password wrong');

	// create and assign jsonwebtoken
	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
	// res.cookie('token', token, { secure: true, maxAge: 120000, httpOnly: false });

	req.session.user = req.body.email;

	res.header('auth-token', token).send(token);

	// (async () => {
	// 	try {
	// 		const client = redis.createClient({ socket: { port: 6379 } });
	// 		await client.connect();

	// 		console.log('connected');
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// })();

	// await redisClient.connect();
	// await redisClient.on('error', (err: any) => console.log('Redis Client Error', err));

	// await redisClient.set('key', 'value');

	// await jwtr
	// 	.sign(payload, secret)
	// 	.then((token: any) => {
	// 		res.header('auth-token', token).send(token);
	// 	})
	// 	.catch((error: any) => {
	// 		console.log(error);
	// 	});
	// res.json({ auth: true, token: token });

	// res.send('logged in');

	// await client.connect().then(
	// 	await jwtr
	// 		.sign(payload, secret)
	// 		.then((token: any) => {
	// 			res.header('auth-token', token).send(token);
	// 			res.json({ auth: true, token: token });
	// 		})
	// 		.catch((error: any) => {
	// 			console.log(error);
	// 		})
	// );
};

// export const logoutUser = async (req: Request<ILogin> | any, res: Response) => {
// 	console.log(req.session);
// 	if (req.session) {
// 		req.session.destroy((err: any) => {
// 			if (err) {
// 				res.status(400).send('Unable to log out');
// 			} else {
// 				res.send('Logout successful');
// 			}
// 		});
// 	} else {
// 		res.end();
// 	}
// };

export const logoutUser = async (req: Request | any, res: Response) => {
	// console.log(req.cookies);
	// req.session.destroy();
	// res.clearCookie('token');
	// res.cookie('token', '', { maxAge: 1, httpOnly: true });
	// console.log('Cookies: ', req.cookies);
	// req.session = null;
	// res.redirect('/');
	// res.clearCookie('token');

	// delete req.session;
	// res.cookie('token', '', { maxAge: 1 });
	// res.redirect('/');

	// res.clearCookie = function clearCookie() {
	// 	var opts = { expires: new Date(1), path: '/' };

	// 	return this.cookie('token', '', opts);
	// };
	// res.clearCookie('token').send('');
	// req.session.sid = null;

	console.log(req.session);
	req.session.destroy(function (err: any) {
		if (err) {
			console.log(err);
			res.send('Error');
		} else {
			res.clearCookie('token');
			console.log(req.session);
			res.send('logged out');
		}
	});

	// return res.sendStatus(200);

	// res.end();

	// res.clearCookie('token');
	// return res.status(200).redirect('/');

	// res.cookie('token', '', { maxAge: 1 });
};
