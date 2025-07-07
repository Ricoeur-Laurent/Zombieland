import express from 'express';
import usersControllers from '../../controllers/usersControllers.js';

const router = express.Router();

router.post('/', usersControllers.userCreate);

export default router;
