import express from "express";
import attractionsController from "../../controllers/attractionsControllers.js";
import reviewsControllers from "../../controllers/reviewsControllers.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

// Retrieve all attractions
router.get("/", attractionsController.getAllAttractions);

// retrieve one attraction
router.get("/:id", attractionsController.getOneAttraction);

// retrieve one attraction by slug
router.get("/slug/:slug", attractionsController.getOneAttractionBySlug);

// Create one attraction
router.post("/", attractionsController.createAttraction);

// Update an attraction
router.patch("/:id", attractionsController.updateAttraction);

// Delete an attraction
router.delete("/:id", attractionsController.deleteAttraction);

// Retrieve all reviews for a specific attraction
router.get("/:id/reviews", reviewsControllers.getReviewsByAttraction);

// Create a new review for a specific attraction
router.post("/:id/reviews", verifyToken, reviewsControllers.createReview);

export default router;
