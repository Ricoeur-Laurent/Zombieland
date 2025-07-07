import bcrypt from 'bcrypt';
import { Users } from '../models/users.js';

const loginControllers = {
	async getAllUsers(req, res) {
		try {
			const users = await Users.findAll();
			res.json(users);
		} catch (error) {
			console.error('Erreur lors de la récupération des users :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la récupération des users',
			});
		}
	},

	async getOneUser(req, res) {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ error: 'Email et mot de passe requis' });
		}
		try {
			const user = await Users.findOne({ where: { email } });
			if (!user) {
				return res
					.status(401)
					.json({ error: 'Identifiants invalides' });
			}
			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				return res
					.status(401)
					.json({ error: 'Identifiants invalides' });
			}
			const { id, name, email: safeEmail, created_at } = user;
			res.status(200).json({
				id,
				name,
				safeEmail,
				created_at,
				message: 'Connexion réussie',
			});
		} catch (error) {
			console.error('Erreur lors du login :', error);
			res.status(500).json({ error: 'Erreur serveur lors du login' });
		}
	},
};

export default loginControllers;
