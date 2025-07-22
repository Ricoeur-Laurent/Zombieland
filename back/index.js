import dotenv from 'dotenv';

dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import seed from './src/migration/seed.js';
import { initDatabase } from './src/migration/sync.js';
import router from './src/routers/router.js';
import stripeRouter from './src/routers/routes/stripe.routes.js';
import stripeWebhookRouter from './src/routers/routes/stripeWebhook.routes.js';

const app = express();

app.use((req, res, next) => {
	const allowedOrigins = [
	  'http://localhost:3000',
	  'http://localhost:3001',
	  'https://zombieland-front-vercel.vercel.app',
	];
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
	  res.setHeader('Access-Control-Allow-Origin', origin);
	}
  
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Vary', 'Origin');
  
	if (req.method === 'OPTIONS') {
	  return res.sendStatus(204); // ✅ corrige le blocage navigateur
	}
  
	next();
  });
  

const corsOptions = {
	origin: [
		'http://localhost:3000', // Allowed local frontend origins
		'http://localhost:3001',
		'https://zombieland-front-vercel.vercel.app', // ✅ domaine Vercel
	],
	credentials: true, // Allow credentials (cookies, auth headers)
	methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], // Allowed HTTP methods
};
app.use(cors(corsOptions)); // Apply CORS middleware with options

//stripe webhook must come before the body parsers
// Stripe requires the raw body for webhook signature verification
app.use('/api/stripe', stripeWebhookRouter);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Parse cookies from HTTP requests
app.use(cookieParser());
// Main Stripe API routes (for checkout, payments, etc)
app.use('/api/stripe', stripeRouter);
app.use('/api', router);
const PORT = process.env.PORT || 5000;

// Start the server asynchronously
async function startServer() {
	try {
		await initDatabase();
		await seed();
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Erreur au démarrage :', error);
		process.exit(1);
	}
}

startServer();
