import { Categories, Attractions } from '../models/index.js';
import { createAttractionSchema, updateAttractionSchema } from '../schemas/attractions.js';
import validator from 'validator';

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
			return res.status(200).json({
				message: `Attractions récupérées avec succès`,
				allAttractions,
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des attractions : ', error);
			res.status(500).json({
				message: 'Erreur serveur interne lors de la récupération de toutes les attractions',
			});
		}
	},

	// retrieve one attraction
	async getOneAttraction(req, res) {
		const { id } = req.checkedParams;

		try {
			const oneAttraction = await Attractions.findByPk(id);
			if (!oneAttraction) {
				return res.status(404).json({ message: `L'attraction est introuvable` });
			}
			return res.status(200).json({ message: `Attraction récupérée avec succès`, oneAttraction });
		} catch (error) {
			console.error(`Erreur lors de la récupération de l'attraction`, error);
			res.status(500).json({
				message: `Erreur serveur interne lors de la récupération de l'attraction`,
			});
		}
	},

	// retrieve one attraction by slug
	async getOneAttractionBySlug(req, res) {
		const { slug } = req.checkedParams;
		try {
			const oneAttraction = await Attractions.findOne({
				where: { slug },
				include: {
					model: Categories,
					as: 'categories',
					attributes: ['id', 'name'],
				},
			});
			if (!oneAttraction) {
				return res.status(404).json({ message: `L'attraction est introuvable` });
			}
			return res.status(200).json({ message: `Attraction récupérée avec succès`, oneAttraction });
		} catch (error) {
			console.error(`Erreur lors de la récupération de l'attraction`, error);
			res.status(500).json({
				message: `Erreur serveur interne lors de la récupération de l'attraction`,
			});
		}
	},

	//  create one attraction
	async createAttraction(req, res) {
		// Data control with Zod
		const newAttraction = createAttractionSchema.safeParse(req.body);
		if (!newAttraction.success) {
			return res.status(400).json({
				message: 'Erreur lors de la validation des données via Zod',
				errors: newAttraction.error.issues,
			});
		}

		// Sanitize and validate input fields
		const rawImage = newAttraction.data.image.trim();

		// Check if image is a valid URL with http/https
		if (!validator.isURL(rawImage, { protocols: ['http', 'https'], require_protocol: true })) {
			return res.status(400).json({
				message: "Le champ 'image' doit contenir une URL valide.",
			});
		}

		// Allow only .jpeg, .jpg, or .webp image file extensions
		const allowedExtensions = ['.jpeg', '.jpg', '.webp'];
		const lowerImage = rawImage.toLowerCase();
		const hasValidExtension = allowedExtensions.some((ext) => lowerImage.endsWith(ext));
		if (!hasValidExtension) {
			return res.status(400).json({
				message: "L'URL de l'image doit se terminer par .jpeg, .jpg ou .webp.",
			});
		}

		// Prepare sanitized data to store in database
		const sanitizedData = {
			name: validator.escape(newAttraction.data.name.trim()),
			image: rawImage,
			description: validator.escape(newAttraction.data.description.trim()),
			slug: validator.whitelist(newAttraction.data.slug.trim().toLowerCase(), 'a-z0-9-'),
		};

		// Check if the name already exists
		const nameExists = await Attractions.findOne({ where: { name: sanitizedData.name } });
		if (nameExists) {
			return res.status(409).json({ error: "Nom d'attraction déjà utilisé." });
		}

		// Check if the image URL already exists
		const imageExists = await Attractions.findOne({ where: { image: sanitizedData.image } });
		if (imageExists) {
			return res.status(409).json({ error: 'URL déjà utilisé.' });
		}

		// New attraction creation
		try {
			const attraction = await Attractions.create(sanitizedData);
			return res.status(201).json({ message: 'Attraction créée avec succès', attraction });
		} catch (error) {
			console.error(`Erreur lors de la création de l'attraction `, error);
			res.status(500).json({
				message: `Erreur serveur interne lors de la création de l'attraction`,
			});
		}
	},

	// update one attraction
	async updateAttraction(req, res) {
		const { id } = req.checkedParams;

		// Data control with Zod
		const attractionUpdate = updateAttractionSchema.safeParse(req.body);
		if (!attractionUpdate.success) {
			return res.status(400).json({
				message: 'Erreur lors de la validation des données via Zod',
				errors: attractionUpdate.error.issues,
			});
		}
		// Attraction update
		try {
			const attraction = await Attractions.findByPk(id);
			if (!attraction) {
				return res.status(404).json({ message: `L'attraction est introuvable` });
			}

			const sanitizedData = {
				name: validator.escape(attractionUpdate.data.name.trim()),
				description: validator.escape(attractionUpdate.data.description.trim()),
				slug: validator.whitelist(attractionUpdate.data.slug.trim().toLowerCase(), 'a-z0-9-'),
				image: attractionUpdate.data.image.trim(),
			};

			// Validate image URL
			if (
				!validator.isURL(sanitizedData.image, {
					protocols: ['http', 'https'],
					require_protocol: true,
				})
			) {
				return res.status(400).json({ message: "Le champ 'image' doit contenir une URL valide." });
			}

			// Check allowed extensions
			const allowedExtensions = ['.jpeg', '.jpg', '.webp'];
			const lowerImage = sanitizedData.image.toLowerCase();
			const hasValidExtension = allowedExtensions.some((ext) => lowerImage.endsWith(ext));
			if (!hasValidExtension) {
				return res.status(400).json({
					message: "L'URL de l'image doit se terminer par .jpeg, .jpg ou .webp.",
				});
			}

			// --- Uniqueness checks if values are changing ---
			if (sanitizedData.name !== attraction.name) {
				const nameExists = await Attractions.findOne({ where: { name: sanitizedData.name } });
				if (nameExists) {
					return res.status(409).json({ error: "Nom d'attraction déjà utilisé." });
				}
			}

			if (sanitizedData.image !== attraction.image) {
				const imageExists = await Attractions.findOne({ where: { image: sanitizedData.image } });
				if (imageExists) {
					return res.status(409).json({ error: 'URL déjà utilisée.' });
				}
			}

			await attraction.update(sanitizedData);
			return res.status(200).json({
				message: 'Attraction modifiée avec succès.',
				attraction,
			});
		} catch (error) {
			console.error(`Erreur lors de la modification de l'attraction `, error);
			res.status(500).json({
				message: `Erreur serveur interne lors de la modification de l'attraction`,
			});
		}
	},

	// delete one attraction
	async deleteAttraction(req, res) {
		const { id } = req.checkedParams;

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
			res.status(500).json({
				message: `Erreur serveur interne lors de la suppression de l'attraction`,
			});
		}
	},

	// Get attractions by category
	async getAttractionsByCategory(req, res) {
		const { id } = req.checkedParams;
		try {
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

			res.status(200).json({
				message: `Attractions récupérées avec succès`,
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
