import express from 'express';
import loginControllers from '../../controllers/loginControllers.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// get one user
router.post('/', loginControllers.getOneUser);

export default router;
