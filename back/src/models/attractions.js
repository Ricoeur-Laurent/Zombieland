import { sequelize } from './sequelize.js';
import { Model, DataTypes } from 'sequelize';

// Define a class that represents the 'Attractions' model
export class Attractions extends Model {}

// Initialize the model with fields (columns) and options
Attractions.init(
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
		image: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		slug: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: 'attractions',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
);
