import express from "express";
import attractionsController from "../../controllers/attractionsControllers.js";
import { checkParams } from "../../middlewares/checkParams.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

// Retrieve all attractions
/**
 * @openapi
 * /api/attractions:
 *   get:
 *     summary: retrieves all attractions
 *     tags:
 *       - Attractions - open
 *     responses:
 *       200:
 *         description: List of all attractions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Attractions not found
 *       500:
 *         description: Erreur serveur
 */
router.get("/", attractionsController.getAllAttractions);

// Retrieve one attraction by id
/**
 * @openapi
 * /api/attractions/{id}:
 *   get:
 *     summary: retrieves attraction corresponding to a specific id
 *     tags:
 *       - Attractions - open
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: id of the attraction requested
 *     responses:
 *       200:
 *         description: Detail for one attraction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction'
 *       404:
 *         description: Attraction not found
 *       500:
 *         description: server error
 */
router.get("/:id", checkParams, attractionsController.getOneAttraction);

// retrieve one attraction by slug
/**
 * @openapi
 * /api/attractions/slug/{slug}:
 *   get:
 *     summary: retrieves attraction corresponding to a specific slug
 *     tags:
 *       - Attractions - open
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: slug of the attraction requested
 *     responses:
 *       200:
 *         description: Detail for one attraction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction'
 *       404:
 *         description: Attraction not found
 *       500:
 *         description: Server error
 */
router.get("/slug/:slug", checkParams, attractionsController.getOneAttractionBySlug);

// retrieve attractions by category
/**
 * @openapi
 * /api/attractions/category/{id}:
 *   get:
 *     summary: retrieves all attractions corresponding to a specific category
 *     tags:
 *       - Attractions - open
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: category of the attractions requested
 *     responses:
 *       200:
 *         description: all attractions in the given category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attraction'
 *       404:
 *         description: Attractions not found
 *       500:
 *         description: Server error
 */
router.get("/category/:id", checkParams, attractionsController.getAttractionsByCategory);

// Create one attraction
/**
 * @openapi
 * /api/attractions:
 *   post:
 *     summary: creates a new attraction
 *     tags:
 *       - Attractions - available with token & admin
 *     requestBody:
 *       description: information about the new attraction
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attraction'
 *     responses:
 *       201:
 *         description: attraction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction'
 *       409:
 *         description: Name or image already exists in the database
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, verifyAdmin, attractionsController.createAttraction);

// Update an attraction
/**
 * @openapi
 * /api/attractions/{id}:
 *   patch:
 *     summary: updates an existing attraction
 *     tags:
 *       - Attractions - available with token & admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attraction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attraction_update'
 *     responses:
 *       200:
 *         description: attraction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction_update'
 *       404:
 *         description: Attraction not found
 *       500:
 *         description: Server error
 */
router.patch("/:id",verifyToken, verifyAdmin, checkParams, attractionsController.updateAttraction);

// Delete an attraction
/**
 * @openapi
 * /api/attractions/{id}:
 *   delete:
 *     summary: deletes an attraction by ID
 *     tags:
 *       - Attractions - available with token & admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attraction to delete
 *     responses:
 *       200:
 *         description: attraction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Attraction not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", verifyToken, verifyAdmin, checkParams, attractionsController.deleteAttraction);

export default router;
