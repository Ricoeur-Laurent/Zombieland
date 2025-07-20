import { sequelize } from './sequelize.js';
import { Model, DataTypes } from 'sequelize';
import { Users } from './users.js';
import { Attractions } from './attractions.js';

// Define the Reviews model extending Sequelize's Model class
export class Reviews extends Model {}

// Initialize the Reviews model schema and options
Reviews.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		rating: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Users,
				key: 'id',
			},
		},
		attractionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Attractions,
				key: 'id',
				onDelete: 'CASCADE',
			},
		},
	},
	{
		sequelize,
		tableName: 'reviews',
		timestamps: true,
		underscored: true,
	},
);
