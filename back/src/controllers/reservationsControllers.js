import { Reservations } from '../models/reservations.js';

const reservationsControllers = {

	// retrieve all reservations
	async getAllReservations(req, res) {
		try {
			const reservations = await Reservations.findAll();
			return res
				.status(200)
				.json({
					message: 'Reservations récupérées avec succès',
					reservations,
				});
		} catch (error) {
			console.error('Erreur lors de la récupération des réservations :', error,
			);
			res
				.status(500)
				.json({
					error: 'Erreur serveur lors de la récupération des réservations.',
				});
		}
	},

	// retrieve one reservation by id
	async getOneReservation(req, res) {
		const { id } = req.params
		try {
			const oneReservation = await Reservations.findByPk(id)
			if (!oneReservation) {
				console.log(`La reservation n°${id} est introuvable`)
				return res.status(404).json({ message: `La reservation n°${id} est introuvable` })
			}
			return res
				.status(200)
				.json({
					message: 'Reservation récupérée avec succès',
					oneReservation,
				});
		} catch (error) {
			console.error(`Erreur lors de la récupération de la réservation n° ${id} `, error)
			res
				.status(500)
				.json({ message: `Erreur serveur interne lors de la récupération de la réservation n° ${id}` })
		}
	},

	// Create a reservation
	async createReservation(req, res) {
		try {
			const { visit_date, nb_participants, amount, user_id } = req.body;
			if (!visit_date || !nb_participants || !amount || !user_id) {
				return res
					.status(400)
					.json({ error: 'Tous les champs sont requis.' });
			}
			const reservation = await Reservations.create({
				visit_date,
				nb_participants,
				amount,
				userId: user_id,
			});
			return res
				.status(201)
				.json({
					message: 'Réservation créée avec succès.',
					reservation,
				});
		} catch (error) {
			console
				.error('Erreur lors de la création de la réservation :', error,
				);
			res
				.status(500)
				.json({
					error: 'Erreur serveur lors de la création de la réservation.',
				});
		}
	},

	// Update a reservation
	async updateReservation(req, res) {
		const { id } = req.params
		try {
			const reservation = await Reservations.findByPk(id)
			if (!reservation) {
				return res
					.status(404)
					.json({ error: "reservation non trouvée" })
			}
			await reservation.update(req.body)
			return res
				.status(200)
				.json({
					message: 'Réservation modifiée avec succès.',
					reservation,
				});
		} catch (error) {
			console
				.error('Erreur lors de la modification de la réservation :', error,
				);
			res
				.status(500)
				.json({
					error: 'Erreur serveur lors de la modification de la réservation.',
				});
		}
	},

	// delete a reservation
	async deleteReservation(req, res) {
		const { id } = req.params
		try {
			const reservation = await Reservations.findByPk(id)
			if (!reservation) {
				return res
					.status(404)
					.json({ error: "La réservation demandée n'existe pas" });
			}
			await reservation.destroy()
			return res
				.status(200)
				.json({
					message: 'Réservation supprimée avec succès.'
				});
		} catch (error) {
			console
				.error(
					'Erreur lors de la suppression de la réservation :', error,
				);
			res
				.status(500)
				.json({
					error: 'Erreur serveur lors de la suppression de la réservation.',
				});
		}
	}

};

export default reservationsControllers;
