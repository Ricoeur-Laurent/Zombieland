import { sequelize } from './sequelize.js';
import { Model, DataTypes } from 'sequelize';

export class Users extends Model {}

Users.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		firstname: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		lastname: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		phone: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
		admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		sequelize,
		tableName: 'users',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
);
