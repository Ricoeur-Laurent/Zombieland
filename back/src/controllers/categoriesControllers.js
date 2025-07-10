import { Categories } from '../models/categories.js';
import { createCategorySchema, updateCategorySchema } from '../schemas/categories.js';
import paramsSchema from '../schemas/params.js';

const categoriesControllers = {
	// Retrieve all categories
	async getAllCategories(req, res) {
		try {
			const categories = await Categories.findAll();

			res.json(categories);
		} catch (error) {
			console.error('Erreur lors de la récupération des catégories :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la récupération des catégories.',
			});
		}
	},

	// Retrieve one category by ID
	async getOneCategory(req, res) {

		// req.params data control with Zod
		const id = paramsSchema.safeParse(req.params)
		if (!id.success) {
			return res
				.status(400)
				.json({
					message: "req.params ne respecte pas les contraintes",
					error: id.error.issues
				})
		}

		try {
			const oneCategory = await Categories.findByPk(id.data.id);
			if (!oneCategory) {
				console.log(`La catégorie n°${id} est introuvable`);
				return res.status(404).json({
					message: `La catégorie est introuvable`,
				});
			}
			res.json(oneCategory);
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
		const newCategory = createCategorySchema.safeParse(req.body)
		if (!newCategory.success) {
			return res
				.status(400)
				.json({
					message: "Erreur lors de la validation des données via Zod",
					error: newCategory.error.issues
				})
		}

		// category creation
		try {
			const category = await Categories.create(newCategory.data);
			return res.status(201).json({
				message: 'Catégorie créée avec succès.',
				category,
			});
		} catch (error) {
			console.error('Erreur lors de la création de la catégorie :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la création de la catégorie.',
			});
			return res.status(201).json({
				message: 'Catégorie créée avec succès.',
				category,
			});
		}
	},

	// Update an existing category by ID
	async updateCategory(req, res) {

		// req.params data control with Zod
		const id = paramsSchema.safeParse(req.params)
		if (!id.success) {
			return res
				.status(400)
				.json({
					message: "req.params ne respecte pas les contraintes",
					error: id.error.issues
				})
		}

		// req.body control with Zod
		const newCategoryName = createCategorySchema.safeParse(req.body)
		if (!newCategoryName.success) {
			return res
				.status(400)
				.json({
					message: "Erreur lors de la validation des données via Zod",
					error: newCategoryName.error.issues
				})
		}
console.log("new category name = ", newCategoryName.data.name)
		// update of category name
		try {

			const category = await Categories.findByPk(id.data.id);

			if (!category) {
				return res.status(404).json({ error: 'Catégorie non trouvée.' });
			}
			category.name = newCategoryName.data.name;
			await category.save();

			return res.json({
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
		try {
			const { id } = req.params;

			const category = await Categories.findByPk(id);

			if (!category) {
				return res.status(404).json({ error: 'Catégorie non trouvée.' });
			}

			await category.destroy();

			return res.json({ message: 'Catégorie supprimée avec succès.' });
		} catch (error) {
			console.error('Erreur lors de la suppression de la catégorie :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la suppression de la catégorie.',
			});
		}
	},
};
export default categoriesControllers;
