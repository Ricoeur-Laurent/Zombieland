import { Users } from '../models/users.js';

const loginControllers = {

  async getAllUsers(req, res) {
    try {
      const users = await Users.findAll();
      
      res.json(users);

    } catch (error) {
      console.error('Erreur lors de la récupération des users :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des users' });
    }
  },

  async getOneUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
      const user = await Users.findOne({ where: { email, password } });
      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      res.status(200).json(user);

    } catch (error) {
      console.error('Erreur lors du login :', error);
      res.status(500).json({ error: 'Erreur serveur lors du login' });
    }
  }
};


export default loginControllers;