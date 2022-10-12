import express from 'express';

const router = express.Router();
const verify = require('./verifyToken');

import {
	getBooks,
	createBook,
	getBook,
	deleteBook,
	updateBook,
} from '../controllers/books';

// all routes here already start with /books
router.get('/', getBooks);

router.post('/', verify, createBook);

router.get('/:id', getBook);

router.delete('/:id', deleteBook);

router.patch('/:id', updateBook);

export default router;
