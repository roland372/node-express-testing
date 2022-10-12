import { Document } from 'mongoose';

export interface IBook extends Document {
	author: string;
	favourites: boolean;
	id: string;
	imageUrl: string;
	lastModified: Date;
	pages: number;
	status: string;
	rating: number;
	title: string;
}
