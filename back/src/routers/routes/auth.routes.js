import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken.js';


const router = express.Router();

router.get('/verify', verifyToken, (req, res) => {
    res.json({
        message: "Token valide",
        user: req.user,
    });
});

export default router;
