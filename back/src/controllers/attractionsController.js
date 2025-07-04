import { Attractions } from "../models/attractions.js";

const attractionsController = {
    async getAllAttractions(req, res) {
        try {
            const allAttractions = await Attractions.findAll()
            res.json(allAttractions)
        } catch (error) {
            console.error("Erreur lors de la récupération des attractions : ", error)
            res.status(500).json({ message: "Erreur serveur interne lors de la récupération de toutes les attractions" })
        }
    },

    async getOneAttraction(req, res) {
        const { id } = req.params
        try {
            const oneAttraction = await Attractions.findByPk(id)
            if (!oneAttraction) {
                console.log(`L'attraction n°${id} est introuvable`)
                return res.status(404).json({ message: `L'attraction n°${id} est introuvable` })
            }
            res.json(oneAttraction)
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'attraction n° ${id} `, error)
            res.status(500).json({ message: `Erreur serveur interne lors de la récupération de l'attraction n° ${id} ` })
        }
    }
}

export default attractionsController