import e from 'express';
import { Categories } from '../models/categories.js';

const categoriesControllers = {
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

	async getOneCategory(req, res) {
		const { id } = req.params;
		try {
			const oneCategory = await Categories.findByPk(id);
			if (!oneCategory) {
				console.log(`La catégorie n°${id} est introuvable`);
				return res.status(404).json({
					message: `La catégorie n°${id} est introuvable`,
				});
			}
			res.json(oneCategory);
		} catch (error) {
			console.error(`Erreur lors de la récupération de la catégorie n° ${id} `, error);
			res.status(500).json({
				message: `Erreur serveur interne lors de la récupération de la catégorie n° ${id}`,
			});
		}
	},

	async categoryCreate(req, res) {
		try {
			const { name } = req.body;
			if (!name) {
				return res.status(400).json({ error: 'Tous les champs sont requis.' });
			}
			const category = await Categories.create({
				name,
			});
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

	async updateCategory(req, res) {
		try {
			const { id } = req.params;
			const { name } = req.body;

			if (!name) {
				return res.status(400).json({ error: 'Le nom est requis.' });
			}

			const category = await Categories.findByPk(id);

			if (!category) {
				return res.status(404).json({ error: 'Catégorie non trouvée.' });
			}
			category.name = name;
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
