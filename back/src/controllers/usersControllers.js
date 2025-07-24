import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

import validator from "validator";
import {
	adminUserCreateSchema,
	signUpSchema,
	updatePswdSchema,
	updateUserSchema,
} from "../schemas/user.js";

const signUpControllers = {
	// Get all users
	async getAllUsers(req, res) {
		try {
			//changed here so we are sure than the boolean admin is sent, and we are sure not to send the password created_at....
			const users = await Users.findAll({
				attributes: ["id", "firstname", "lastname", "email", "phone", "admin"],
			});
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
		// Validate incoming data with Zod schema and we also check if the request come from an admin
		const isAdminRoute = req.originalUrl.includes("/admin/");
		const schema = isAdminRoute ? adminUserCreateSchema : signUpSchema;

		const newUser = schema.safeParse(req.body);
		if (!newUser.success) {
			return res.status(400).json({
				message: "Erreur lors de la validation des données via Zod",
				errors: newUser.error.issues,
			});
		}

		// Sanitize the input
		const firstname = validator.escape(newUser.data.firstname.trim());
		const lastname = validator.escape(newUser.data.lastname.trim());
		const email = validator.normalizeEmail(newUser.data.email.trim());
		const phone = validator.whitelist(newUser.data.phone, "0-9");
		const password = newUser.data.password?.trim() || "changeme";

		try {
			// Check if the email is already used by another user
			const emailExists = await Users.findOne({ where: { email } });
			if (emailExists) {
				return res.status(409).json({ error: "Cet email est déjà utilisé." });
			}
			// Check if the phone number is already in use
			const phoneExists = await Users.findOne({ where: { phone } });
			if (phoneExists) {
				return res
					.status(409)
					.json({ error: "Ce numéro de téléphone est déjà utilisé." });
			}

			// Secure the password with bcrypt hashing before saving
			const hashedPassword = await bcrypt.hash(password, 10);

			const admin = isAdminRoute ? newUser.data.admin === true : false;

			const user = await Users.create({
				firstname,
				lastname,
				email,
				password: hashedPassword,
				phone,
				admin, // adding admin if road admin
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

			if (!isAdminRoute) {
				res.cookie("zombieland_token", token, {
					httpOnly: true,
					// secure: process.env.NODE_ENV === "production",
					// sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
					maxAge: 24 * 60 * 60 * 1000,
				});
			}

			res.status(201).json({
				message: "Utilisateur créé avec succès.",

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
		// Check if the user is authenticated

		const isAdmin = req.user?.admin;
		const id = isAdmin ? req.checkedParams.id : req.user?.id;
		if (!req.user) {
			return res.status(401).json({ error: "Utilisateur non authentifié" });
		}
		const userUpdate = updateUserSchema.safeParse(req.body);
		if (!userUpdate.success) {
			return res.status(400).json({
				message: "Erreur lors de la validation des données via Zod",
				errors: userUpdate.error.issues,
			});
		}

		try {
			// Sanitize inputs
			const firstname = userUpdate.data.firstname
				? validator.escape(validator.trim(userUpdate.data.firstname))
				: undefined;
			const lastname = userUpdate.data.lastname
				? validator.escape(validator.trim(userUpdate.data.lastname))
				: undefined;
			const email = userUpdate.data.email
				? validator.normalizeEmail(userUpdate.data.email)
				: undefined;
			const phone = userUpdate.data.phone
				? validator.whitelist(userUpdate.data.phone, "0-9")
				: undefined;
			const password = userUpdate.data.password || undefined;
			const admin =
				typeof userUpdate.data.admin === "boolean"
					? userUpdate.data.admin
					: undefined;

			// Find user
			const user = await Users.findByPk(id);
			if (!user) {
				return res.status(404).json({ error: "Utilisateur non trouvé." });
			}
			if (!isAdmin && admin !== undefined) {
				return res.status(403).json({ error: "Accès interdit à ce champ." });
			}
			// Vérification email déjà utilisé
			if (email) {
				const existingEmailUser = await Users.findOne({ where: { email } });
				if (existingEmailUser && existingEmailUser.id !== parseInt(id)) {
					return res.status(409).json({ error: "Cet email est déjà utilisé." });
				}
			}

			// Vérification téléphone déjà utilisé
			if (phone) {
				const existingPhoneUser = await Users.findOne({ where: { phone } });
				if (existingPhoneUser && existingPhoneUser.id !== parseInt(id)) {
					return res
						.status(409)
						.json({ error: "Ce numéro de téléphone est déjà utilisé." });
				}
			}

			// Update fields
			if (firstname) user.firstname = firstname;
			if (lastname) user.lastname = lastname;
			if (email) user.email = email;
			if (phone) user.phone = phone;
			if (isAdmin && admin !== undefined) user.admin = admin;

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
					admin: user.admin,
					updated_at: user.updated_at,
				},
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour :", error);
			res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
		}
	},

	// Delete a user
	async deleteUser(req, res) {
		// Check if the user is authenticated
		if (!req.user) {
			return res.status(401).json({ error: "Utilisateur non authentifié" });
		}
		const id =
			req.user.admin && req.checkedParams?.id
				? req.checkedParams.id
				: req.user.id;
		try {
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

	// update user password
	async editUserPswd(req, res) {
		// Check if the user is authenticated
		if (!req.user) {
			return res.status(401).json({ error: "Utilisateur non authentifié" });
		}
		// validate incoming data using Zod
		const { id } = req.user;
		const pswdUpdate = updatePswdSchema.safeParse(req.body);

		if (!pswdUpdate.success) {
			return res.status(400).json({
				message: "Erreur lors de la validation des données via Zod",
				errors: pswdUpdate.error.issues,
			});
		}

		// sanitize input fields
		const oldPassword = pswdUpdate.data.oldPswd.trim();
		const newPassword = pswdUpdate.data.newPswd.trim();

		// collect current pswd and match it against provided password
		try {
			const user = await Users.findByPk(id);

			if (!user) {
				return res.status(404).json({ error: "Utilisateur non trouvé." });
			}

			const passwordMatch = await bcrypt.compare(oldPassword, user.password);

			if (!passwordMatch) {
				return res
					.status(401)
					.json({ error: "le mot de passe fournit est incorrect" });
			}

			// Hash new password before saving it in database
			const hashedPassword = await bcrypt.hash(newPassword, 10);

			// update user's password in database
			user.password = hashedPassword;

			await user.save();
			res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
		} catch (error) {
			console.error("Erreur lors de la récupération du mot de passe :", error);
			res.status(500).json({
				error: "Erreur serveur lors de la récupération du mot de passe.",
			});
		}
	},
};

export default signUpControllers;
