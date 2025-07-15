import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { loginSchema } from '../schemas/user.js';
import { Users } from '../models/users.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error('La clé JWT_SECRET est manquante dans le fichier .env');
}

const loginControllers = {
	// Controller for user login
	async getOneUser(req, res) {
		// Validate incoming data using Zod schema
		const loginAttempt = loginSchema.safeParse(req.body);
		if (!loginAttempt.success) {
			return res.status(400).json({
				message: 'Erreur lors de la validation des données via Zod',
				errors: loginAttempt.error.issues,
			});
		}

		// Sanitize input fields
		const email = validator.normalizeEmail(loginAttempt.data.email.trim());
		const password = loginAttempt.data.password.trim();

		try {
			const user = await Users.findOne({ where: { email } });
			if (!user) {
				return res.status(401).json({ error: 'Identifiants invalides' });
			}

			// Compare provided password with hashed password in the database
			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				return res.status(401).json({ error: 'Identifiants invalides' });
			}

			// Build JWT payload with basic user info
			const tokenPayload = {
				id: user.id,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				admin: user.admin,
			};

			// Sign the token using JWT_SECRET and configured expiration
			const token = jwt.sign(tokenPayload, JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN,
			});

			// Extract user info to return in the response (excluding password)
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
