import express from "express";
import attractionsController from "../../controllers/attractionsControllers.js";
import { checkParams } from "../../middlewares/checkParams.js";

const router = express.Router();

// Retrieve all attractions
/**
 * @openapi
 * /attractions:
 *   get:
 *     summary: retrieves all attractions
 *     responses:
 *       200:
 *         description: all attractions retrieved
 *       400: attractions could not be found
 */
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
