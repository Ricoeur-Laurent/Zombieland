import { Users } from '../models/users.js';
import bcrypt from 'bcrypt';

const signUpControllers = {
	async getAllUsers(req, res) {
		try {
			const users = await Users.findAll();
			res.json(users);
		} catch (error) {
			console.error('Erreur lors de la récupération des users :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la récupération des users.',
			});
		}
	},

	async userCreate(req, res) {
		const { firstname, lastname, email, password, phone } = req.body;
		if (!firstname || !lastname || !email || !password || !phone) {
			return res
				.status(400)
				.json({ error: 'Tous les champs sont requis.' });
		}
		try {
			const existingUser = await Users.findOne({ where: { email } });
			if (existingUser) {
				return res
					.status(409)
					.json({
						error: 'Un utilisateur avec cet email existe déjà.',
					});
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = await Users.create({
				firstname,
				lastname,
				email,
				password: hashedPassword,
				phone,
			});
			const {
				id,
				firstname: fName,
				lastname: lName,
				email: userEmail,
				phone: userPhone,
				created_at,
			} = user;
			res.status(201).json({
				message: 'Utilisateur créé avec succès.',
				user: {
					id,
					firstname: fName,
					lastname: lName,
					email: userEmail,
					phone: userPhone,
					created_at,
				},
			});
		} catch (error) {
			console.error("Erreur lors de l'inscription :", error);
			res.status(500).json({
				error: "Erreur serveur lors de l'inscription.",
			});
		}
	},
};

export default signUpControllers;
