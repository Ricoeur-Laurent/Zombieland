import { Reservations } from "../models/reservations.js";


const adminReservationsController = {
    // retrieve all reservations
    async getAllReservations(req, res) {
        try {
            const allReservations = await Reservations.findAll()
            res.json(allReservations)
        } catch (error) {
            console.error("Erreur lors de la récupération de toutes les reservations : ", error)
            res.status(500).json({ message: "Erreur serveur interne lors de la récupération de toutes les réservations" })
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
            res.json(oneReservation)
        } catch (error) {
            console.error(`Erreur lors de la récupération de la réservation n° ${id} `, error)
            res.status(500).json({ message: `Erreur serveur interne lors de la récupération de la réservation n° ${id}`})
        }
    },

    // create one reservation

    async createOneReservation (req,res) {
        const data = req.body
        // ici il faut jouter un id dans les data, requis par la relation reservation / users
        try {
            const newReservation = await Reservations.create(data)
            res.json(newReservation)
        } catch (error) {
            console.error("Erreur lors de la création d'une reservation : ", error)
            res.status(500).json({ message: "Erreur serveur interne lors de la création d'une reservation" })
        }
    }
}

export default adminReservationsController