import { Categories } from '../models/categories.js';
import { createCategorySchema, updateCategorySchema } from '../schemas/categories.js';
import validator from 'validator';

const categoriesControllers = {
	// Retrieve all categories
	async getAllCategories(req, res) {
		try {
			const categories = await Categories.findAll();

			return res.status(200).json({
				message: `Catégorie récupérées avec succès`,
				categories,
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des catégories :', error);
			return res.status(500).json({
				error: 'Erreur serveur lors de la récupération des catégories.',
			});
		}
	},

	// Retrieve one category by ID
	async getOneCategory(req, res) {
		const { id } = req.checkedParams;

		try {
			const oneCategory = await Categories.findByPk(id);
			if (!oneCategory) {
				return res.status(404).json({
					message: `Catégorie non trouvée`,
				});
			}
			return res.status(200).json({
				message: `Catégorie récupérée avec succès`,
				oneCategory,
			});
		} catch (error) {
			console.error(`Erreur lors de la récupération de la catégorie n° ${id} `, error);
			res.status(500).json({
				message: `Erreur serveur interne lors de la récupération de la catégorie`,
			});
		}
	},

	// Create a new category
	async createCategory(req, res) {
		// Data control with Zod
		const newCategory = createCategorySchema.safeParse(req.body);
		if (!newCategory.success) {
			return res.status(400).json({
				message: 'Erreur lors de la validation des données via Zod',
				error: newCategory.error.issues,
			});
		}

		// Sanitize fields
		const sanitizedData = {
			name: validator.escape(newCategory.data.name.trim()),
		};

		try {
			// Check if name already exists
			const nameExists = await Categories.findOne({ where: { name: sanitizedData.name } });
			if (nameExists) {
				return res.status(409).json({ error: 'Nom de catégorie déjà utilisé.' });
			}

			// category creation
			const category = await Categories.create(sanitizedData);
			return res.status(201).json({
				message: 'Catégorie créée avec succès.',
				category,
			});
		} catch (error) {
			console.error('Erreur lors de la création de la catégorie :', error);
			return res.status(500).json({
				error: 'Erreur serveur lors de la création de la catégorie.',
			});
		}
	},

	// Update an existing category by ID
	async updateCategory(req, res) {
		const { id } = req.checkedParams;

		// Data control with Zod
		const newCategoryName = updateCategorySchema.safeParse(req.body);
		if (!newCategoryName.success) {
			return res.status(400).json({
				message: 'Erreur lors de la validation des données via Zod',
				error: newCategoryName.error.issues,
			});
		}

		// Sanitize the new name
		const newName = validator.escape(newCategoryName.data.name.trim());
		// update of category name
		try {
			const category = await Categories.findByPk(id);

			if (!category) {
				return res.status(404).json({ error: 'Catégorie non trouvée.' });
			}

			// Check if another category already uses this name
			const categoryExists = await Categories.findOne({ where: { name: newName } });
			if (categoryExists) {
				return res.status(409).json({ error: 'Nom de catégorie déjà utilisé.' });
			}

			// Apply update
			category.name = newName;
			await category.save();

			return res.status(200).json({
				message: 'Catégorie mise à jour avec succès.',
				category,
			});
		} catch (error) {
			console.error('Erreur lors de la mise à jour de la catégorie :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la mise à jour de la catégorie.',
			});
		}
	},

	// Delete a category by ID
	async deleteCategory(req, res) {
		const { id } = req.checkedParams;
		try {
			const category = await Categories.findByPk(id);

			if (!category) {
				return res.status(404).json({ error: 'Catégorie non trouvée.' });
			}

			await category.destroy();

			return res.status(200).json({ message: 'Catégorie supprimée avec succès.' });
		} catch (error) {
			console.error('Erreur lors de la suppression de la catégorie :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la suppression de la catégorie.',
			});
		}
	},
};
export default categoriesControllers;
