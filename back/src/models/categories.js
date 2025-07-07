import { sequelize } from './sequelize.js';
import { Model, DataTypes } from 'sequelize';

export class Categories extends Model {}

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
