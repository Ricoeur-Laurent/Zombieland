import express from 'express';
import loginControllers from '../../controllers/loginControllers.js';

const router = express.Router();

router.get('/', loginControllers.getAllUsers);
router.post('/', loginControllers.getOneUser);

export default router;
