import express from 'express';
import attractionsController from '../../controllers/attractionsControllers.js';

const router = express.Router();

router.get('/', attractionsController.getAllAttractions);
router.get('/:id', attractionsController.getOneAttraction);

export default router;
