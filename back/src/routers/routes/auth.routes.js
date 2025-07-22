import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// Route de vérification du token
router.get('/verify', verifyToken, (req, res) => {
  // ✅ Headers CORS explicitement définis ici
  res.setHeader('Access-Control-Allow-Origin', 'https://zombieland-front-vercel.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.json({
    message: 'Token valide',
    user: req.user,
  });
});

export default router;
