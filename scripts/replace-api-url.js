const fs = require("node:fs");
const path = require("node:path");

const apiBase = "http://localhost:5000";

function walk(dir, callback) {
	fs.readdirSync(dir).forEach((f) => {
		const dirPath = path.join(dir, f);
		const isDirectory = fs.statSync(dirPath).isDirectory();
		isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
	});
}

walk("./front/src", (filePath) => {
	if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
		const content = fs.readFileSync(filePath, "utf8");

		// Match fetch('http://localhost:5000/...')
		const regex = new RegExp(
			`fetch\\((['"\`])${apiBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^'"\`]+)\\1`,
			"g",
		);

		const replaced = content.replace(
			regex,
			"fetch(`${process.env.NEXT_PUBLIC_API_URL}$2`",
		);

		if (replaced !== content) {
			fs.writeFileSync(filePath, replaced, "utf8");
			console.log(`✅ Updated API URL in ${filePath}`);
		}
	}
});

console.log("✅ Replacement completed for all fetch calls.");
