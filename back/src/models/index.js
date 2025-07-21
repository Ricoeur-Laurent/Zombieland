import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from './sequelize.js';
import { Users } from './users.js';
import { Reviews } from './reviews.js';
import { Reservations } from './reservations.js';
import { Attractions } from './attractions.js';
import { Categories } from './categories.js';

// One-to-Many: A user can write multiple reviews
Users.hasMany(Reviews, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

// Many-to-One: Each review belongs to one user
Reviews.belongsTo(Users, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

// One-to-Many: A user can make multiple reservations
Users.hasMany(Reservations, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

// Many-to-One: Each reservation belongs to one user
Reservations.belongsTo(Users, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

// One-to-Many: An attraction can have many reviews
Attractions.hasMany(Reviews, {
	foreignKey: {
		name: 'attractionId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

// Many-to-One: A review belongs to one attraction
Reviews.belongsTo(Attractions, {
	foreignKey: {
		name: 'attractionId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

// Many-to-Many: A category can have many attractions
// and an attraction can belong to many categories
Categories.belongsToMany(Attractions, {
	through: 'attractions_has_categories',
	foreignKey: 'categoryId',
	otherKey: 'attractionId',
	as: 'attractions', 
});

// Many-to-Many: An attraction can have many categories
Attractions.belongsToMany(Categories, {
	through: 'attractions_has_categories',
	foreignKey: 'attractionId',
	otherKey: 'categoryId',
	as: 'categories', 
});
console.log(Categories.associations.attractions);
export { sequelize, Users, Reservations, Attractions, Reviews, Categories };
