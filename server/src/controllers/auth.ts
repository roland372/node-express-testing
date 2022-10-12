import { Request, Response } from 'express';
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

import { ILogin, IRegister } from '../types/validation';

//* validation
import { loginValidation, registerValidation } from '../utils/validation';

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

export const loginUser = async (req: Request<ILogin>, res: Response) => {
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
	res.header('auth-token', token).send(token);
	// res.json({ auth: true, token: token });

	// res.send('logged in');
};
