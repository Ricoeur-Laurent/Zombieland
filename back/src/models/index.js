import dotenv from 'dotenv';
import { sequelize } from './sequelize.js';

dotenv.config();

import { Users } from './users.js';
import { Reviews } from './reviews.js';
import { Reservations } from './reservations.js';
import { Attractions } from './attractions.js';
import { Categories } from './categories.js';


Users.hasMany(Reviews, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

Reviews.belongsTo(Users, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

Users.hasMany(Reservations, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

Reservations.belongsTo(Users, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

Attractions.hasMany(Reviews, {
	foreignKey: {
		name: 'attractionId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});

Reviews.belongsTo(Attractions, {
	foreignKey: {
		name: 'attractionId',
		allowNull: false,
	},
	onDelete: 'CASCADE',
});


Categories.belongsToMany(Attractions, {
	through: 'attractions_has_categories',
	foreignKey: 'categoryId',
	otherKey: 'attractionId',
	as: 'attractions', 
});

Attractions.belongsToMany(Categories, {
	through: 'attractions_has_categories',
	foreignKey: 'attractionId',
	otherKey: 'categoryId',
	as: 'categories', 
});
console.log(Categories.associations.attractions);
export { sequelize, Users, Reservations, Attractions, Reviews, Categories };
