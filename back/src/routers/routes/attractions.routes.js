import express from 'express';
import attractionsController from '../../controllers/attractionsControllers.js';

const router = express.Router();

// Retrieve all attractions
router.get('/', attractionsController.getAllAttractions);

// retrieve one attraction
router.get('/:id', attractionsController.getOneAttraction);

// Create one attraction
router.post('/', attractionsController.createAttraction)

// Update an attraction
router.patch('/:id', attractionsController.updateAttraction)

// Delete an attraction
router.delete('/:id', attractionsController.deleteAttraction)

export default router;
