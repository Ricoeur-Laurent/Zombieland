import express from 'express';
import reviewsController from '../../controllers/reviewsControllers.js';


const router = express.Router();

// get all reviews
router.get('/:id', reviewsController.getReviewsByAttraction);

// Create a review
router.post('/:id', reviewsController.createReview)

export default router;
