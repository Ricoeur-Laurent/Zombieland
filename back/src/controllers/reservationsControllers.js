import { Reservations } from "../models/reservations.js";

const reservationsControllers = {

  async getAllReservations(req, res) {
    try {
      const reservations = await Reservations.findAll();

      res.json(reservations);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des réservations.' });
    }
  }
};

export default reservationsControllers;
