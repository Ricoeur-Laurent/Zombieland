import dotenv from 'dotenv';
import express from 'express'
import { sequelize } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express' });
});

// Connexion + sync avant démarrage serveur
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à la BDD réussie');
    return sequelize.sync({ force: true });
  })
  .then(() => {
    console.log('✅ Synchronisation réussie');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Erreur :', error.message);
  });
