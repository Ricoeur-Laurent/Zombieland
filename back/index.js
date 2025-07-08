import dotenv from 'dotenv';
import express from 'express';
import router from './src/routers/router.js';
import { sequelize } from './src/models/sequelize.js';
import seed from './src/migration/seed.js';

dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
const PORT = process.env.PORT || 5000;

// integration of SYnc in index to run it when launching API live on render
sequelize.sync({ alter: true }) // ou force: true temporairement
  .then(() => console.log('✅ Tables synchronisées'))
  .catch(err => console.error('❌ Erreur sync Sequelize', err));

seed()

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
