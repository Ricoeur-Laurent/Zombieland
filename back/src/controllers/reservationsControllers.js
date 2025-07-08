import { Users } from '../models/index.js';
import { Reservations } from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('La clé JWT_SECRET est manquante dans le fichier .env');
}

const reservationsControllers = {
	// retrieve all reservations
	async getAllReservations(req, res) {
		try {
			if (req.user.admin !== 'true') {
				return res.status(403).json({ error: 'Accès interdit : Admin uniquement.' });
			}
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
	async getOneReservation(req, res) {
		const { id } = req.params;
		const userId = req.user.id;
		try {
			const oneReservation = await Reservations.findByPk(id);
			if (!oneReservation) {
				console.log(`La reservation n°${id} est introuvable`);
				return res.status(404).json({ message: `La reservation n°${id} est introuvable` });
			}
			if (oneReservation.userId !== userId) {
				return res.status(403).json({ message: 'Accès refusé à cette réservation' });
			}
			return res.status(200).json({
				message: 'Reservation récupérée avec succès',
				oneReservation,
			});
		} catch (error) {
			console.error(`Erreur lors de la récupération de la réservation n° ${id} `, error);
			res.status(500).json({
				message: `Erreur serveur interne lors de la récupération de la réservation n° ${id}`,
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
				console.log(`Aucune réservation trouvée pour l'utilisateur n°${userId}`);
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
		try {
			const { visit_date, nb_participants, amount, user_id } = req.body;
			const userId = req.user.id;
			if (!visit_date || !nb_participants || !amount) {
				return res.status(400).json({ error: 'Tous les champs sont requis.' });
			}
			const reservation = await Reservations.create({
				visit_date,
				nb_participants,
				amount,
				userId,
			});
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
		const { id } = req.params;
		const userId = req.user.id;
		try {
			const reservation = await Reservations.findByPk(id);
			if (!reservation) {
				return res.status(404).json({ error: 'reservation non trouvée' });
			}
			if (reservation.userId !== userId) {
				return res
					.status(403)
					.json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres réservations' });
			}
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
		const { id } = req.params;
		const userId = req.user.id;
		try {
			const reservation = await Reservations.findByPk(id);
			if (!reservation) {
				return res.status(404).json({ error: "La réservation demandée n'existe pas" });
			}
			if (reservation.userId !== userId) {
				return res
					.status(403)
					.json({ error: 'Accès refusé : vous ne pouvez supprimer que vos propres réservations' });
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
