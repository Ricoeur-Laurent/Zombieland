import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// Route to verify if the provided token is valid
// This route is protected by the verifyToken middleware
router.get('/verify', verifyToken, (req, res) => {
	res.json({
		message: 'Token valide',
		user: req.user,
	});
});

export default router;
