import express from "express";
import attractionsController from "../../controllers/attractionsControllers.js";
import { checkParams } from "../../middlewares/checkParams.js";

const router = express.Router();

// Retrieve all attractions
router.get("/", attractionsController.getAllAttractions);

// retrieve one attraction
router.get("/:id", checkParams, attractionsController.getOneAttraction);

// retrieve one attraction by slug
router.get("/slug/:slug", checkParams, attractionsController.getOneAttractionBySlug);

// retrieve attractions by catégory
router.get('/category/:id', checkParams, attractionsController.getAttractionsByCategory)

// Create one attraction
router.post("/", attractionsController.createAttraction);

// Update an attraction
router.patch("/:id", checkParams, attractionsController.updateAttraction);

// Delete an attraction
router.delete("/:id", checkParams, attractionsController.deleteAttraction);

export default router;
