import express from 'express';
import reviewsController from '../../controllers/reviewsControllers.js';
import { checkParams } from '../../middlewares/checkParams.js';

const router = express.Router();

// get all reviews
router.get('/:id', checkParams,reviewsController.getReviewsByAttraction);

// Create a review
router.post('/:id', checkParams, reviewsController.createReview)

export default router;
