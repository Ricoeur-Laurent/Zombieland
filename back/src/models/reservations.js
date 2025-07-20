import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.js';
import { Users } from './users.js';

// Define the Reservations model extending Sequelize's Model class
export class Reservations extends Model {}

// Initialize the Reservations model schema and options
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
