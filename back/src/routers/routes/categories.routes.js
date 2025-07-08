import express from 'express';
import categoriesControllers from '../../controllers/categoriesControllers.js';
import attractionsControllers from '../../controllers/attractionsControllers.js';

const router = express.Router();

// get all categories
router.get('/', categoriesControllers.getAllCategories);

// get one category
router.get('/:id', categoriesControllers.getOneCategory);

// create one category
router.post('/', categoriesControllers.createCategory);

// update one category
router.patch('/:id', categoriesControllers.updateCategory);

// delete one category
router.delete('/:id', categoriesControllers.deleteCategory);

router.get('/:id/attractions', attractionsControllers.getAttractionsByCategory);

export default router;
