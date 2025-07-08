import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ error: 'Token manquant' });
	}

	const token = authHeader.split(' ')[1]; // "Bearer token"

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		console.log('Decoded token:', decoded);
		req.user = {
			id: decoded.id,
			firstname: decoded.firstname,
			lastname: decoded.lastname,
			email: decoded.email,
			admin: decoded.admin,
		};
		next();
	} catch (error) {
		return res.status(403).json({ error: 'Token invalide ou expiré' });
	}
}
