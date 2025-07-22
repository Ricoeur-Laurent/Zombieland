import fs from "fs";
import path from "path";

// Extensions à scanner
const extensions = [".js", ".ts", ".jsx", ".tsx"];

// Répertoire racine du projet frontend
const baseDir = "./"; // ou "./src" si tu veux restreindre

function walk(dir, fileCallback) {
	fs.readdirSync(dir).forEach((file) => {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			walk(fullPath, fileCallback);
		} else if (extensions.includes(path.extname(fullPath))) {
			fileCallback(fullPath);
		}
	});
}

function cleanBearerHeader(filePath) {
	let content = fs.readFileSync(filePath, "utf-8");

	// Supprime Authorization: Bearer token
	const newContent = content.replace(
		/Authorization\s*:\s*`?Bearer\s*\$\{?token\}?`?,?/g,
		""
	);

	if (newContent !== content) {
		fs.writeFileSync(filePath, newContent, "utf-8");
		console.log(`✅ Nettoyé : ${filePath}`);
	}
}

walk(baseDir, cleanBearerHeader);