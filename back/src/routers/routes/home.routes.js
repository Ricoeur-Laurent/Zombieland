import express from 'express';
import attractionsController from '../../controllers/attractionsControllers.js';

const router = express.Router();

router.get('/', attractionsController.getAllAttractions);

export default router;
