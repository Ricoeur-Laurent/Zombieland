import express from 'express';
import homeControllers from '../../controllers/homeControllers.js';

const router = express.Router();

router.get('/', homeControllers.getAllAttractions);

export default router;
