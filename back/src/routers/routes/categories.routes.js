import express from 'express';
import categoriesControllers from '../../controllers/categoriesControllers.js';
import attractionsControllers from '../../controllers/attractionsControllers.js';
import { checkParams } from '../../middlewares/checkParams.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestion des catégories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Récupère toutes les catégories
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur serveur lors de la récupération des catégories.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Survival
 */

// get all categories
router.get('/', categoriesControllers.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a category by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the category to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '400':
 *         description: Invalid parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid ID
 *       '404':
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error while retrieving the category
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Survival"
 */

// get one category
router.get('/:id', checkParams, categoriesControllers.getOneCategory);

// create one category
router.post('/', categoriesControllers.createCategory);

// update one category
router.patch('/:id', checkParams, categoriesControllers.updateCategory);

// delete one category
router.delete('/:id', checkParams, categoriesControllers.deleteCategory);

router.get('/:id/attractions', checkParams, attractionsControllers.getAttractionsByCategory);

export default router;
