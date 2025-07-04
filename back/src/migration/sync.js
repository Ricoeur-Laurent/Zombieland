import { sequelize } from '../models/index.js';

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à la BDD réussie');
    return sequelize.sync({ force: true });
  })
  .catch(error => {
    console.error('❌ Erreur :', error.message);
  });
