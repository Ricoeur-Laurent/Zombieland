import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.options('/verify', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://zombieland-front-vercel.vercel.app');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Vary', 'Origin');
	return res.sendStatus(204);
  });
  

// Route de vérification du token
router.get('/verify', verifyToken, (req, res) => {


  res.json({
    message: 'Token valide',
    user: req.user,
  });
});

export default router;
