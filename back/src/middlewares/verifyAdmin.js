// Middleware to restrict access to admin users only
export function verifyAdmin(req, res, next) {

	// Check if the user is authenticated
	if (!req.user) {
		return res.status(401).json({ error: 'Utilisateur non authentifié' });
	}

	// Check if the user has admin privileges
	if (!req.user.admin) {
		return res.status(403).json({ error: 'Accès refusé : rôle admin requis' });
	}
	next();
}
