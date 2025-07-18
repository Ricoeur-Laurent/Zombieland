import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
	// Try to get the token from the Authorization header first

	const token = req.cookies.zombieland_token;

	// If still no token, deny access
	if (!token) {
		return res.status(401).json({ error: "Token manquant" });
	}

	try {
		// Verify token using the secret key
		const decoded = jwt.verify(token, JWT_SECRET);

		// Attach user data from token to the request object for later use
		req.user = {
			id: decoded.id,
			firstname: decoded.firstname,
			lastname: decoded.lastname,
			email: decoded.email,
			admin: decoded.admin,
		};

		next();
	} catch (error) {
		return res.status(403).json({ error: "Token invalide ou expiré" });
	}
}
