import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from '../models/users.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('La clé JWT_SECRET est manquante dans le fichier .env');
}

const loginControllers = {
	// Get one user by email and password
	async getOneUser(req, res) {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: 'Email et mot de passe requis' });
		}
		try {
			const user = await Users.findOne({ where: { email } });
			if (!user) {
				return res.status(401).json({ error: 'Identifiants invalides' });
			}
			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				return res.status(401).json({ error: 'Identifiants invalides' });
			}

			const tokenPayload = {
				id: user.id,
				email: user.email,
				admin: user.admin,
			};

			const token = jwt.sign(tokenPayload, JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN,
			});

			const { id, firstname, lastname, email: safeEmail, admin, created_at } = user;
			res.status(200).json({
				message: 'Connexion réussie',
				token,
				user: {
					id,
					firstname,
					lastname,
					safeEmail,
					admin,
					created_at,
				},
			});
		} catch (error) {
			console.error('Erreur lors du login :', error);
			res.status(500).json({ error: 'Erreur serveur lors du login' });
		}
	},
};

export default loginControllers;
