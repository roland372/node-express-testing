import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		min: 6,
		max: 30,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		max: 255,
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 30,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('User', userSchema);
