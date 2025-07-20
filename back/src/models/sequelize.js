import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Create a new Sequelize instance to connect to the database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
	define: {
		underscored: true,
	},
});

export { sequelize };
