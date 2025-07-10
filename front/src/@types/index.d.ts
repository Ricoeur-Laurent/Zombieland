export interface Attraction {
	id: number;
	name: string;
	slug: string;
	image: string;
	categories: Category[];
	description: string;
}
export interface Category {
	id: number;
	name: string;
}

export interface Review {
	id: number;
	comment: string;
	rating: number;
}
