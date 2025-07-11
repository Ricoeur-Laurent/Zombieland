
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


import { signUpSchema, updateUserSchema } from '../schemas/user.js';
import validator from 'validator';



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
			const { id } = req.checkedParams;
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

		// Validate incoming data with Zod schema
		const newUser = signUpSchema.safeParse(req.body);
		if (!newUser.success) {
			return res.status(400).json({
				message: 'Erreur lors de la validation des données via Zod',
				errors: newUser.error.issues,
			});

		}

		// Sanitize the input
		const firstname = validator.escape(newUser.data.firstname.trim());
		const lastname = validator.escape(newUser.data.lastname.trim());
		const email = validator.normalizeEmail(newUser.data.email.trim());
		const phone = validator.whitelist(newUser.data.phone, '0-9');
		const password = newUser.data.password.trim();

		try {

			// Check if the email is already used by another user
			const emailExists = await Users.findOne({ where: { email } });
			if (emailExists) {
				return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
			}
			// Check if the phone number is already in use
			const phoneExists = await Users.findOne({ where: { phone } });
			if (phoneExists) {
				return res.status(409).json({ error: 'Ce numéro de téléphone est déjà utilisé.' });

			}

			// Secure the password with bcrypt hashing before saving
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = await Users.create({
				firstname,
				lastname,
				email,
				password: hashedPassword,
				phone,
			});
			
			// Destructure useful fields to return to the frontend (omit password)
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
		// Validate incoming request data with Zod schema
		const userUpdate = updateUserSchema.safeParse(req.body);
		if (!userUpdate.success) {
			return res.status(400).json({
				message: 'Erreur lors de la validation des données via Zod',
				errors: userUpdate.error.issues,
			});
		}
		try {
			const { id } = req.checkedParams;

			// Sanitize input values
			const firstname = userUpdate.data.firstname
				? validator.escape(validator.trim(userUpdate.data.firstname))
				: undefined;
			const lastname = userUpdate.data.lastname
				? validator.escape(validator.trim(userUpdate.data.lastname))
				: undefined;
			const email = userUpdate.data.email ? validator.normalizeEmail(userUpdate.data.email) : undefined;
			const phone = userUpdate.data.phone ? validator.escape(validator.trim(userUpdate.data.phone)) : undefined;
			const password = userUpdate.data.password ? userUpdate.data.password : undefined;

			// Check if the user with the provided ID exists
			const user = await Users.findByPk(id);
			if (!user) {

				return res.status(404).json({ error: 'Utilisateur non trouvé.' });
			}

			// Check if the new email is already used by another user
			const existingEmailUser = await Users.findOne({ where: { email } });
			if (existingEmailUser && existingEmailUser.id !== parseInt(id)) {
				return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
			}

			// Check if the new phone number is already used by another user
			const existingPhoneUser = await Users.findOne({ where: { phone } });
			if (existingPhoneUser && existingPhoneUser.id !== parseInt(id)) {
				return res.status(409).json({ error: 'Ce numéro de téléphone est déjà utilisé.' });

			}

			// Update user fields if they are provided
			if (firstname) user.firstname = firstname;
			if (lastname) user.lastname = lastname;
			if (email) user.email = email;
			if (phone) user.phone = phone;
			// If password is provided, hash it before saving
			if (password) {
				const hashedPassword = await bcrypt.hash(password, 10);
				user.password = hashedPassword;
			}
			await user.save();

			// Send updated user data in the response (excluding password)
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
			const { id } = req.checkedParams;
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
