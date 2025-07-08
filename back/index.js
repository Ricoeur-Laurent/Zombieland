import dotenv from 'dotenv';
import express from 'express';
import router from './src/routers/router.js';
import seed from './src/migration/seed.js';
import { initDatabase } from './src/migration/sync.js';


dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
const PORT = process.env.PORT || 5000;

// init database for Render server
initDatabase();
seed();

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
