import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const signUpControllers = {
	// Get all users
	async getAllUsers(req, res) {
		try {
			const users = await Users.findAll();
			res.json(users);
		} catch (error) {
			console.error("Erreur lors de la récupération des users :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la récupération des users.",
			});
		}
	},
	// Retrieve one user by id
	async getOneUser(req, res) {
		try {
			const { id } = req.params;

			const user = await Users.findByPk(id, {
				attributes: { exclude: ["password"] },
			});

			if (!user) {
				return res.status(404).json({ error: "Utilisateur non trouvé." });
			}

			res.json(user);
		} catch (error) {
			console.error("Erreur lors de la récupération de l'utilisateur :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la récupération de l'utilisateur.",
			});
		}
	},
	// Create a new user
	async userCreate(req, res) {
		const { firstname, lastname, email, password, phone } = req.body;
		if (!firstname || !lastname || !email || !password || !phone) {
			return res.status(400).json({ error: "Tous les champs sont requis." });
		}
		try {
			const existingUser = await Users.findOne({ where: { email } });
			if (existingUser) {
				return res.status(409).json({
					error: "Un utilisateur avec cet email existe déjà.",
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

			const tokenPayload = {
				id: user.id,
				email: user.email,
				admin: user.admin,
			};

			const token = jwt.sign(tokenPayload, JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN,
			});

			res.status(201).json({
				message: "Utilisateur créé avec succès.",
				token,
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
	// Update an existing user
	async updateUser(req, res) {
		try {
			const { id } = req.params;
			const { firstname, lastname, email, password, phone } = req.body;

			const user = await Users.findByPk(id);
			if (!user) {
				return res.status(404).json({ error: "Utilisateur non trouvé." });
			}

			if (firstname) user.firstname = firstname;
			if (lastname) user.lastname = lastname;
			if (email) user.email = email;
			if (phone) user.phone = phone;
			if (password) {
				const hashedPassword = await bcrypt.hash(password, 10);
				user.password = hashedPassword;
			}

			await user.save();
			res.json({
				message: "Utilisateur mis à jour avec succès.",
				user: {
					id: user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					phone: user.phone,
					updated_at: user.updated_at,
				},
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la mise à jour.",
			});
		}
	},
	// Delete a user
	async deleteUser(req, res) {
		try {
			const { id } = req.params;
			const user = await Users.findByPk(id);

			if (!user) {
				return res.status(404).json({ error: "Utilisateur non trouvé." });
			}

			await user.destroy();

			res.json({ message: "Utilisateur supprimé avec succès." });
		} catch (error) {
			console.error("Erreur lors de la suppression :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la suppression.",
			});
		}
	},
};

export default signUpControllers;
