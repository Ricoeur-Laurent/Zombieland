export function verifyAdmin(req, res, next) {
	if (!req.user) {
		return res.status(401).json({ error: 'Utilisateur non authentifié' });
	}
	if (!req.user.admin) {
		return res.status(403).json({ error: 'Accès refusé : rôle admin requis' });
	}
	next();
}
