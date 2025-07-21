import { sequelize } from '../models/index.js';

// Initialize and synchronize the database
export async function initDatabase() {
	try {
		// Test the database connection
		await sequelize.authenticate();
		console.log('✅ Connexion à la BDD réussie');

		// Synchronize all defined models with the database
		await sequelize.sync({ force: true }); // alter:true ensuite
		console.log('✅ Tables synchronisées');
		
	} catch (err) {
		console.error('❌ Erreur de sync :', err);
		throw err;
	}
}
initDatabase()