import { v4 as uuidv4 } from 'uuid';

import { TReqRes } from '../types/resReq';
import { IBook } from '../types/book';
const Book = require('../models/book');

declare global {
	namespace Express {
		interface Response {
			paginatedResults: string;
		}
	}
}

// export const getBooks: TReqRes = async (req, res) => {
// 	try {
// 		const books: IBook = await Book.find();
// 		res.json(books);
// 		// console.log(books);
// 		// res.json(res.paginatedResults);

// 	} catch (err: any) {
// 		res.status(500).json({ message: err.message });
// 	}
// };

export const getBooks: TReqRes = async (req, res) => {
	try {
		const filter: any = {};
		const books: IBook = await Book.find();

		if (req.query.favourites) {
			filter.favourites = req.query.favourites === 'true';
			// console.log('test');
			console.log(filter);

			const books: IBook = await Book.find(filter);
			
			res.json(books);
		} else {
			res.json(books);
		}
	} catch (error) {
		res.status(500).send(error);
	}
};

export const createBook: TReqRes = async (req, res) => {
	const book: IBook = new Book({
		...req.body,
		id: uuidv4(),
		lastModified: new Date(),
	});

	try {
		const newBook: IBook = await book.save();
		res.status(201).json(newBook);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const getBook: TReqRes = async (req, res) => {
	// console.log(req.params); // returns id value
	const { id } = req.params;

	// let singleBook;

	try {
		const singleBook: IBook = await Book.findById(id);
		res.json(singleBook);

		if (singleBook === null) {
			return res.status(404).json({ message: 'book not found' });
		}
	} catch (err: any) {
		return res.status(500).json({ message: err.message });
	}

	// res.json(singleBook);
};

export const deleteBook: TReqRes = async (req, res) => {
	const { id } = req.params;

	try {
		const singleBook: IBook = await Book.findById(id);
		await singleBook.remove();
		res.send(`book with ${id} deleted from database`);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
};

export const updateBook: TReqRes = async (req, res) => {
	const { id } = req.params;

	const { author, favourites, imageUrl, pages, status, rating, title } =
		req.body;

	let singleBook: IBook;

	try {
		singleBook = await Book.findById(id);

		if (author) singleBook.author = author;
		if (favourites === true || favourites === false)
			singleBook.favourites = favourites;
		if (imageUrl) singleBook.imageUrl = imageUrl;
		if (pages) singleBook.pages = pages;
		if (status) singleBook.status = status;
		if (rating) singleBook.rating = rating;
		if (title) singleBook.title = title;
		singleBook.lastModified = new Date();

		await singleBook.updateOne(singleBook);
		res.json(singleBook);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};
