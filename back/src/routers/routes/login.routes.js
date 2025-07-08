import express from 'express';
import loginControllers from '../../controllers/loginControllers.js';

const router = express.Router();

// get one user
router.post('/', loginControllers.getOneUser);

export default router;
