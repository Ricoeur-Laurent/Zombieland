import { sequelize } from '../models/index.js';


export async function initDatabase() {
	try {
		await sequelize.authenticate();
		console.log('✅ Connexion à la BDD réussie');

		await sequelize.sync({ force: true }); // alter:true ensuite
		console.log('✅ Tables synchronisées');
	} catch (err) {
		console.error('❌ Erreur de sync :', err);
		throw err;
	}
}
