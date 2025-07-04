import { Attractions } from '../models/attractions.js';

const homeControllers = {

  async getAllAttractions(req, res) {
    try {
      const attractions = await Attractions.findAll();
      console.log('attractions récupérées avec succès :', attractions);
      res.json(attractions);
    } catch (error) {
      console.error('Erreur lors de la récupération des attractions :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des attractions.' });
    }
  }
};

export default homeControllers;
