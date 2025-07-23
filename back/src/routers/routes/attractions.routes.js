import express from "express";
import attractionsController from "../../controllers/attractionsControllers.js";
import { checkParams } from "../../middlewares/checkParams.js";

const router = express.Router();

// Retrieve all attractions
/**
 * @openapi
 * /api/attractions:
 *   get:
 *     summary: retrieves all attractions
 *     tags:
 *       - Attractions
 *     responses:
 *       200:
 *         description: List of all attractions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *                   description:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Attractions not found
 *       500:
 *         description: Erreur serveur
 */
router.get("/", attractionsController.getAllAttractions);

// // Retrieve one attraction by id
/**
 * @openapi
 * /api/attractions/1:
 *   get:
 *     summary: retrieves all attractions
 *     tags:
 *       - Attractions
 *     responses:
 *       200:
 *         description: Detail for one attraction
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *                   description:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Attraction not found
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", checkParams, attractionsController.getOneAttraction);

// // Retrieve one attraction by slug
// /**
//  * @openapi
//  * /attractions/slug/{slug}:
//  *   get:
//  *     summary: retrieves one attraction per id
//  *     parameters :
//  *      -in: path
//  *      name: slug
//  *      required: true
//  *      schema : 
//  *          type : string
//  *     responses:
//  *       200:
//  *         description:  attraction retrieved
//  *       400: attraction could not be found
//  */

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
