import { Document } from 'mongoose';

export interface ILogin extends Document {
	username: string;
	email: string;
	password: string;
}

export interface IRegister extends Document {
	email: string;
	password: string;
}
