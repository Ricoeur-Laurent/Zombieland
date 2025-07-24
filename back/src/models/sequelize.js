import dotenv from 'dotenv';

dotenv.config()
import { Sequelize } from 'sequelize';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL manquant dans les variables d’environnement');
}

// Create a new Sequelize instance to connect to the database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
	define: {
		underscored: true,
	},
});

export { sequelize };
