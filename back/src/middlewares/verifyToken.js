import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
	// Try to get the token from the Authorization header first
	let token = null;

	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		token = authHeader.split(" ")[1];
	}

	// If not found, try to get it from the cookies
	if (!token && req.cookies && req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		return res.status(401).json({ error: "Token manquant" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

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
