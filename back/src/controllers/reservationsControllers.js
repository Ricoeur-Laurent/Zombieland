import dayjs from "dayjs";
import dotenv from "dotenv";
import { Reservations, Users } from "../models/index.js";
import {
	createReservationAdminSchema,
	createReservationUserSchema,
	updateReservationAdminSchema,
	updateReservationUserSchema,
} from "../schemas/reservations.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error("La clé JWT_SECRET est manquante dans le fichier .env");
}

const reservationsControllers = {
	// retrieve all reservations
	async getAllReservations(req, res) {
		if (!req.user.admin) {
			return res
				.status(403)
				.json({ error: "Accès interdit : Admin uniquement." });
		}
		try {
			const reservations = await Reservations.findAll({
				include: {
					model: Users,
					attributes: ["id", "firstname", "lastname", "email"],
				},
			});

			return res.status(200).json({
				message: "Reservations récupérées avec succès",
				reservations,
			});
		} catch (error) {
			console.error("Erreur lors de la récupération des réservations :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la récupération des réservations.",
			});
		}
	},

	// retrieve one reservation by id
	async getOneReservationByUserId(req, res) {
		const { id } = req.checkedParams;

		const userId = req.user.id;

		try {
			const oneReservation = await Reservations.findByPk(id);
			if (!oneReservation) {
				return res
					.status(404)
					.json({ message: `La reservation n°${id} est introuvable` });
			}
			if (oneReservation.userId !== userId) {
				return res
					.status(403)
					.json({ message: "Accès refusé à cette réservation" });
			}
			return res.status(200).json({
				message: "Reservation récupérée avec succès",
				oneReservation,
			});
		} catch (error) {
			console.error(
				`Erreur lors de la récupération de la réservation n° ${id} `,
				error,
			);
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
					attributes: ["id", "firstname", "lastname", "email"],
				},
			});
			if (!userReservations || userReservations.length === 0) {
				return res
					.status(404)
					.json({
						message: `Aucune réservation trouvée pour l'utilisateur n°${userId}`,
					});
			}
			return res.status(200).json({
				message: "Réservations récupérées avec succès",
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
		const userId = req.user.id;
		const isAdmin = req.user.admin;

		// Check if a user is trying to modify the amount field
		if (!isAdmin && "amount" in req.body) {
			return res.status(403).json({
				error: "Vous n'êtes pas autorisé à modifier le prix.",
			});
		}

		// Choose the appropriate schema based on the user's role
		const schema = isAdmin
			? createReservationAdminSchema
			: createReservationUserSchema;

		// Data control with zod
		const newReservation = schema.safeParse(req.body);

		if (!newReservation.success) {
			return res.status(400).json({
				message: "Erreur lors de la validation des données via Zod",
				error: newReservation.error.issues,
			});
		}

		const price = 66;
		const { nb_participants, visit_date } = newReservation.data;

		// Creation of the reservation
		try {
			const reservationData = {
				visit_date,
				nb_participants,
				userId,
			};

			// Regular users cannot choose price, it’s calculated automatically
			if (!isAdmin) {
				reservationData.amount = nb_participants * price;
			} else {
				// Admins can provide a custom amount
				reservationData.amount = newReservation.data.amount;
			}

			const reservation = await Reservations.create(reservationData);

			return res.status(201).json({
				message: "Réservation créée avec succès.",
				reservation,
			});
		} catch (error) {
			console.error("Erreur lors de la création de la réservation :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la création de la réservation.",
			});
		}
	},

	async updateReservation(req, res) {
		const { id } = req.checkedParams;
		const isAdmin = req.user.admin;
		const userId = req.user.id;
	
		// Interdiction for an user to modify the price
		if (!isAdmin && "amount" in req.body) {
			return res.status(403).json({
				error: "Vous n'êtes pas autorisé à modifier le prix.",
			});
		}
	
		// Validation Schema is different for admin
		const schema = isAdmin
			? updateReservationAdminSchema
			: updateReservationUserSchema;
	
		const updateReservation = schema.safeParse(req.body);
		if (!updateReservation.success) {
			console.log("Échec de validation Zod :", req.body);
			return res.status(400).json({
				message: "Le corps de la requête est invalide.",
				error: updateReservation.error.issues,
			});
		}
	
		try {
			const reservation = await Reservations.findByPk(id);
			if (!reservation) {
				return res.status(404).json({ error: "Réservation non trouvée" });
			}
	
			// if not and admin user1 can only modify user1 resa
			if (!isAdmin && reservation.userId !== userId) {
				return res.status(403).json({
					error:
						"Accès refusé : vous ne pouvez modifier que vos propres réservations",
				});
			}
	
			// Restricted to 10 days only for user, not admin
			if (!isAdmin) {
				const today = dayjs();
				const visitDate = dayjs(reservation.visit_date);
				if (visitDate.diff(today, "day") < 10) {
					return res.status(400).json({
						message:
							"La réservation ne peut pas être modifiée moins de 10 jours avant la date de visite.",
					});
				}
			}
	
			const updateData = { ...updateReservation.data };
	
			// we check the price for users
			if (!isAdmin && "nb_participants" in updateData) {
				const price = 66;
				updateData.amount = updateData.nb_participants * price;
			}
	
			await reservation.update(updateData);
			return res.status(200).json({
				message: "Réservation modifiée avec succès.",
				reservation,
			});
		} catch (error) {
			console.error("Erreur lors de la modification de la réservation :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la modification de la réservation.",
			});
		}
	},
	// delete a reservation
	async deleteReservation(req, res) {
		const { id } = req.checkedParams;

		const userId = req.user.id;
		// deleting reservation
		try {
			const reservation = await Reservations.findByPk(id);
			if (!reservation) {
				return res
					.status(404)
					.json({ error: "La réservation demandée n'existe pas" });
			}
			if (reservation.userId !== userId) {
				return res
					.status(403)
					.json({
						error:
							"Accès refusé : vous ne pouvez supprimer que vos propres réservations",
					});
			}
			const today = dayjs();
			const visitDate = dayjs(reservation.visit_date);
			if (visitDate.diff(today, "day") < 10) {
				return res.status(400).json({
					error:
						"La réservation ne peut pas être annulée moins de 10 jours avant la date de visite.",
				});
			}
			await reservation.destroy();
			return res.status(200).json({
				message: "Réservation supprimée avec succès.",
			});
		} catch (error) {
			console.error("Erreur lors de la suppression de la réservation :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la suppression de la réservation.",
			});
		}
	},
};

export default reservationsControllers;
