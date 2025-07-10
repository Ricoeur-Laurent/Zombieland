import { Reviews, Users, Attractions } from '../models/index.js';
import paramsSchema from '../schemas/params.js';
import { createReviewSchema } from '../schemas/reviews.js';

const reviewsControllers = {
	// Create a new review for a specific attraction
	async createReview(req, res) {

		// req.params data control with Zod
		const id = paramsSchema.safeParse(req.params)
		if (!id.success) {
			return res
			.status(400)
			.json({
				message: "req.params ne respecte pas les contraintes",
				error: idParams.error.issues
			})
		}
		const attractionId = id.data.id
		
		// Control data with Zod
		const newReview = createReviewSchema.safeParse(req.body)
		if(!newReview.success) {
			return res
			.status(400)
				.json({
					message: "Erreur lors de la validation des données via Zod",
					errors: newReview.error.issues
				})
		}
		const userId = req.user.id;
		try {
			const attraction = await Attractions.findByPk(attractionId);
			if (!attraction) {
				return res.status(404).json({ error: 'Attraction non trouvée.' });
			}

			const review = await Reviews.create({
				...newReview.data,
				userId,
				attractionId,
			});

			return res.status(201).json({
				message: 'Avis ajouté avec succès.',
				review,
			});
		} catch (error) {
			console.error('Erreur lors de l’ajout de l’avis :', error);
			return res.status(500).json({ error: 'Erreur serveur lors de l’ajout de l’avis.' });
		}
	},
	// Retrieve all reviews for a specific attraction
	async getReviewsByAttraction(req, res) {
		const { id: attractionId } = req.params;

		try {
			const reviews = await Reviews.findAll({
				where: { attractionId },
				include: {
					model: Users,
					attributes: ['id', 'firstname', 'lastname'],
				},
				order: [['createdAt', 'DESC']],
			});

			return res.status(200).json({
				message: 'Avis récupérés avec succès.',
				reviews,
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des avis :', error);
			res.status(500).json({ error: 'Erreur serveur lors de la récupération des avis.' });
		}
	},
};

export default reviewsControllers;
