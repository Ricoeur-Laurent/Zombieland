import { Categories, Attractions } from '../models/index.js';
import { createAttractionSchema, updateAttractionSchema } from '../schemas/attractions.js';
import paramsSchema from '../schemas/params.js';

const attractionsController = {
	// retrieve all attractions
	async getAllAttractions(req, res) {
		try {
			const allAttractions = await Attractions.findAll({
				include: {
					model: Categories,
					as: 'categories',
					attributes: ['id', 'name'],
				},
			});
			return res
				.status(200)
				.json({ message: `Attractions récupérées avec succès`, allAttractions });
		} catch (error) {
			console.error('Erreur lors de la récupération des attractions : ', error);
			res.status(500).json({
				message: 'Erreur serveur interne lors de la récupération de toutes les attractions',
			});
		}
	},

	// retrieve one attraction
	async getOneAttraction(req, res) {

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
			const oneAttraction = await Attractions.findByPk(id.data.id);
			if (!oneAttraction) {
				console.log(`L'attraction est introuvable`);
				return res.status(404).json({ message: `L'attraction est introuvable` });
			}
			return res.status(200).json({ message: `Attraction récupérée avec succès`, oneAttraction });
		} catch (error) {
			console.error(`Erreur lors de la récupération de l'attraction`, error);
			res
				.status(500)
				.json({ message: `Erreur serveur interne lors de la récupération de l'attraction` });
		}
	},

	//  create one attraction
	async createAttraction(req, res) {

		// Data control with Zod
		const newAttraction = createAttractionSchema.safeParse(req.body)
		if (!newAttraction.success) {
			return res
				.status(400)
				.json({
					message: "Erreur lors de la validation des données via Zod",
					errors: newAttraction.error.issues
				})
		}
console.log("new attraction data = ", newAttraction.data)

		// New attraction creation
		try {
			const attraction = await Attractions.create(newAttraction.data);
			return res.status(201).json({ message: 'Attraction créée avec succès', attraction });
		} catch (error) {
			console.error(`Erreur lors de la création de l'attraction `, error);
			res
				.status(500)
				.json({ message: `Erreur serveur interne lors de la création de l'attraction` });
		}
	},

	// update one attraction
	async updateAttraction(req, res) {
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
		// Data control with Zod
		const attractionUpdate = updateAttractionSchema.safeParse(req.body)
		if (!attractionUpdate.success) {
			return res
				.status(400)
				.json({
					message: "Erreur lors de la validation des données via Zod",
					errors: attractionUpdate.error.issues
				})
		}
		// Attraction update
		try {
			const attraction = await Attractions.findByPk(id.data.id);
			if (!attraction) {
				return res.status(404).json({ message: `L'attraction est introuvable` });
			}
			await attraction.update(attractionUpdate.data);
			return res.status(200).json({
				message: 'Attraction modifiée avec succès.',
				attraction,
			});
		} catch (error) {
			console.error(`Erreur lors de la modification de l'attraction `, error);
			res
				.status(500)
				.json({ message: `Erreur serveur interne lors de la modification de l'attraction` });
		}
	},

	// delete one attraction
	async deleteAttraction(req, res) {
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
			const attraction = await Attractions.findByPk(id.data.id);
			if (!attraction) {
				return res.status(404).json({ error: "L'attraction demandée n'existe pas" });
			}
			await attraction.destroy();
			return res.status(200).json({
				message: 'Attraction supprimée avec succès.',
			});
		} catch (error) {
			console.error(`Erreur lors de la suppression de l'attraction `, error);
			res
				.status(500)
				.json({ message: `Erreur serveur interne lors de la suppression de l'attraction` });
		}
	},

	// Get attractions by category
	async getAttractionsByCategory(req, res) {

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
			const category = await Categories.findByPk(id.data.id, {
				include: {
					model: Attractions,
					as: 'attractions',
					through: { attributes: [] },
				},
			});

			if (!category) {
				return res.status(404).json({ error: 'Catégorie non trouvée.' });
			}

			res.json({
				category: category.name,
				attractions: category.attractions,
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des attractions par catégorie :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la récupération des attractions.',
			});
		}
	},
};

export default attractionsController;
