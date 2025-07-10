import dotenv from 'dotenv';
import { Users } from '../models/index.js';
import { Reservations } from '../models/index.js';
import dayjs from 'dayjs';
import { createReservationSchema, updateReservationSchema } from '../schemas/reservations.js';
import paramsSchema from '../schemas/params.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('La clé JWT_SECRET est manquante dans le fichier .env');
}

const reservationsControllers = {
	// retrieve all reservations
	async getAllReservations(req, res) {

		if (!req.user.admin) {
			return res.status(403).json({ error: 'Accès interdit : Admin uniquement.' });
		}
		try {
			const reservations = await Reservations.findAll();
			return res.status(200).json({
				message: 'Reservations récupérées avec succès',
				reservations,
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des réservations :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la récupération des réservations.',
			});
		}
	},

	// retrieve one reservation by id
	async getOneReservationByUserId(req, res) {

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

		const userId = req.user.id;

		try {
			const oneReservation = await Reservations.findByPk(id.data.id);
			if (!oneReservation) {

				return res.status(404).json({ message: `La reservation n°${id.data.id} est introuvable` });
			}
			if (oneReservation.userId !== userId) {
				return res.status(403).json({ message: 'Accès refusé à cette réservation' });
			}
			return res.status(200).json({
				message: 'Reservation récupérée avec succès',
				oneReservation,
			});
		} catch (error) {
			console.error(`Erreur lors de la récupération de la réservation n° ${id.data.id} `, error);
			res.status(500).json({
				message: `Erreur serveur interne lors de la récupération de la réservation n° ${id.data.id}`,
			});
		}
	},

	// retrieve all reservations by user id
	async getAllReservationsByUserId(req, res) {
		const userId = req.user.id;
		try {
			const userReservations = await Reservations.findAll({
				where: { userId },
				include: {
					model: Users,
					attributes: ['id', 'firstname', 'lastname', 'email'],
				},
			});
			if (!userReservations || userReservations.length === 0) {
				return res
					.status(404)
					.json({ message: `Aucune réservation trouvée pour l'utilisateur n°${userId}` });
			}
			return res.status(200).json({
				message: 'Vos réservations ont été récupérées avec succès',
				userReservations,
			});
		} catch (error) {
			console.error(
				`Erreur lors de la récupération de la réservation pour l'utilisateur n°${userId}`,
				error,
			);
			res.status(500).json({
				message: `Erreur serveur interne lors de la récupération de la réservation pour l'utilisateur n°${userId}`,
			});
		}
	},

	// Create a reservation
	async createReservation(req, res) {

		// Data control with zod
		const newReservation = createReservationSchema.safeParse(req.body)
		if (!newReservation.success) {
			return res
				.status(400)
				.json({
					message: "Erreur lors de la validation des données via Zod",
					error: newReservation.error.issues
				})
		}

		const userId = req.user.id;

		// Creation of the reservation
		try {
			const reservation = await Reservations.create(newReservation.data);
			return res.status(201).json({
				message: 'Réservation créée avec succès.',
				reservation,
			});
		} catch (error) {
			console.error('Erreur lors de la création de la réservation :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la création de la réservation.',
			});
		}
	},

	// Update a reservation
	async updateReservation(req, res) {

		// req.params validation with Zod
		const id = paramsSchema.safeParse(req.params)
		if (!id.success) {
			return res
				.status(400)
				.json({
					message: "req.params ne respecte pas les contraintes",
					error: id.error.issues
				})
		}
		// Data validation with Zod
		const updateReservation = updateReservationSchema.safeParse(req.body)
		if (!updateReservation.success) {
			return res
				.status(400)
				.json({
					message: "req.params ne respecte pas les contraintes",
					error : updateReservation.error.issues
				})
		}

		const userId = req.user.id;
		const reservation = await Reservations.findByPk(id.data.id);
		if (!reservation) {
			return res.status(404).json({ error: 'reservation non trouvée' });
		}
		if (reservation.userId !== userId) {
			return res
				.status(403)
				.json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres réservations' });
		}
		const today = dayjs();
		const visitDate = dayjs(reservation.visit_date);
		if (visitDate.diff(today, 'day') < 10) {
			return res.status(400).json({
				error:
					'La réservation ne peut pas être modifiée moins de 10 jours avant la date de visite.',
			});
		}
		try {
			await reservation.update(req.body);
			return res.status(200).json({
				message: 'Réservation modifiée avec succès.',
				reservation,
			});
		} catch (error) {
			console.error('Erreur lors de la modification de la réservation :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la modification de la réservation.',
			});
		}
	},

	// delete a reservation
	async deleteReservation(req, res) {
		
		// req.params validation with Zod
		const id = paramsSchema.safeParse(req.params)
		if (!id.success) {
			return res
				.status(400)
				.json({
					message: "req.params ne respecte pas les contraintes",
					error: id.error.issues
				})
		}
		const userId = req.user.id;
		// deleting reservation
		try {
			const reservation = await Reservations.findByPk(id.data.id);
			if (!reservation) {
				return res.status(404).json({ error: "La réservation demandée n'existe pas" });
			}
			if (reservation.userId !== userId) {
				return res
					.status(403)
					.json({ error: 'Accès refusé : vous ne pouvez supprimer que vos propres réservations' });
			}
			const today = dayjs();
			const visitDate = dayjs(reservation.visit_date);
			if (visitDate.diff(today, 'day') < 10) {
				return res.status(400).json({
					error:
						'La réservation ne peut pas être annulée moins de 10 jours avant la date de visite.',
				});
			}
			await reservation.destroy();
			return res.status(200).json({
				message: 'Réservation supprimée avec succès.',
			});
		} catch (error) {
			console.error('Erreur lors de la suppression de la réservation :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la suppression de la réservation.',
			});
		}
	},
};

export default reservationsControllers;
