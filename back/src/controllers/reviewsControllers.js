import { Reviews, Users, Attractions } from '../models/index.js';

const reviewsControllers = {
	async createReview(req, res) {
		// Create a new review for a specific attraction
		const { id: attractionId } = req.params;
		const { comment, rating } = req.body;
		const userId = req.user.id;

		if (!comment || !rating) {
			return res.status(400).json({ error: 'Commentaire et note requis.' });
		}

		try {
			const attraction = await Attractions.findByPk(attractionId);
			if (!attraction) {
				return res.status(404).json({ error: 'Attraction non trouvée.' });
			}

			const review = await Reviews.create({
				comment,
				rating,
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
