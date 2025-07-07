import express from 'express';
import signUpControllers from '../../controllers/signUpControllers.js';

const router = express.Router();

router.get('/', signUpControllers.getAllUsers);
router.post('/', signUpControllers.userCreate);

export default router;
