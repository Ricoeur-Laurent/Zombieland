import { Users } from '../models/users.js';

const signUpControllers = {

  async getAllUsers(req, res) {
    try {
      const users = await Users.findAll();

      res.json(users);

    } catch (error) {
      console.error('Erreur lors de la récupération des users :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des users.' });
    }
  },

  async userCreate(req, res) {
    const { firstname, lastname, email, password, phone } = req.body;

    try {
      const user = await Users.create({ firstname, lastname, email, password, phone });

      res.status(201).json(user);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
    }
  }
};

export default signUpControllers;
