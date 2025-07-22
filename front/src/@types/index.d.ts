// Interface representing a single attraction in the ZombieLand park
export interface Attraction {
	id: number;
	name: string;
	slug: string;
	image: string;
	categories: Category[];
	description: string;
}
// Interface representing a category assigned to attractions
export interface Category {
	id: number;
	name: string;
}

// Interface representing a user-submitted review for an attraction
export interface Review {
	id: number;
	comment: string;
	rating: number;
}
