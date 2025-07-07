import { sequelize } from './sequelize.js';
import { Model, DataTypes } from 'sequelize';
import { Users } from './users.js';

export class Reservations extends Model {}

Reservations.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		visit_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		amount: {
			type: DataTypes.DECIMAL(6, 2),
			allowNull: false,
		},
		nb_participants: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Users,
				key: 'id',
				onDelete: 'CASCADE',
			},
		},
	},
	{
		sequelize,
		tableName: 'reservations',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
);
