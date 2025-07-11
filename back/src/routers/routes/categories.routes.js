import express from 'express';
import categoriesControllers from '../../controllers/categoriesControllers.js';
import attractionsControllers from '../../controllers/attractionsControllers.js';
import { checkParams } from '../../middlewares/checkParams.js';

const router = express.Router();

// get all categories
router.get('/', categoriesControllers.getAllCategories);

// get one category
router.get('/:id', checkParams, categoriesControllers.getOneCategory);

// create one category
router.post('/', categoriesControllers.createCategory);

// update one category
router.patch('/:id',checkParams,categoriesControllers.updateCategory);

// delete one category
router.delete('/:id', checkParams,categoriesControllers.deleteCategory);

router.get('/:id/attractions', checkParams,attractionsControllers.getAttractionsByCategory);

export default router;
