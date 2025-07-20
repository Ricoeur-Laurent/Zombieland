import { sequelize } from './sequelize.js';
import { Model, DataTypes } from 'sequelize';

// Define the 'Categories' model by extending Sequelize's Model class
export class Categories extends Model {}

// Initialize the model with its attributes and configuration
Categories.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		tableName: 'categories',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
);
