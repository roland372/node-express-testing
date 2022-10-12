import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
	author: {
		type: String,
		required: true,
	},
	favourites: {
		type: Boolean,
		required: true,
		default: false,
	},
	imageUrl: {
		type: String,
		required: true,
		default:
			'http://www.cams-it.com/wp-content/uploads/2015/05/default-placeholder-150x200.png',
	},
	lastModified: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	pages: {
		type: Number,
		required: false,
	},
	status: {
		type: String,
		required: false,
		default: 'Reading',
	},
	rating: {
		type: Number,
		required: false,
		default: 0,
	},
	title: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Book', bookSchema);
