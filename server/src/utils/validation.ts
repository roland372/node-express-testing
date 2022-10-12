import Joi from 'joi';
import { ILogin, IRegister } from '../types/validation';

export const registerValidation = (data: IRegister) => {
	const userSchema = Joi.object({
		username: Joi.string().min(6).required(),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});
	return userSchema.validate(data);
};

export const loginValidation = (data: ILogin) => {
	const userSchema = Joi.object({
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});
	return userSchema.validate(data);
};

// module.exports.registerValidation = registerValidation;
// module.exports.loginValidation = loginValidation;
