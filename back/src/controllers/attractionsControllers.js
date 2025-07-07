import { Categories, Attractions } from '../models/index.js';

const attractionsController = {
	// retrieve all attractions
	async getAllAttractions(req, res) {
		try {
			const allAttractions = await Attractions.findAll();
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
		const { id } = req.params;
		try {
			const oneAttraction = await Attractions.findByPk(id);
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
		const { name, image, description } = req.body;
		if (!name || !image || !description) {
			return res.status(400).json({ error: 'Tous les champs sont requis.' });
		}
		try {
			const newAttraction = await Attractions.create({
				name,
				image,
				description,
			});
			return res.status(201).json({ message: 'Attraction créée avec succès', newAttraction });
		} catch (error) {
			console.error(`Erreur lors de la création de l'attraction `, error);
			res
				.status(500)
				.json({ message: `Erreur serveur interne lors de la création de l'attraction` });
		}
	},

	// update one attraction
	async updateAttraction(req, res) {
		const { id } = req.params;
		try {
			const attraction = await Attractions.findByPk(id);
			if (!attraction) {
				return res.status(404).json({ message: `L'attraction est introuvable` });
			}
			await attraction.update(req.body);
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
		const { id } = req.params;
		try {
			const attraction = await Attractions.findByPk(id);
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
		try {
			const { id } = req.params;

			const category = await Categories.findByPk(id, {
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
