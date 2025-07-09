const fs = require('node:fs');
const path = require('node:path');

const apiBase = "http://localhost:5000"; // replace with your exact API URL

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./front/src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');

    const regex = new RegExp("(fetch\\(\\s*['\\`])" + apiBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "([^'\\`]*)['\\`]", "g");

    const replaced = content.replace(regex, `$1process.env.NEXT_PUBLIC_API_URL$2'`);

    if (replaced !== content) {
      fs.writeFileSync(filePath, replaced, 'utf8');
      console.log(`✅ Updated API URL in ${filePath}`);
    }
  }
});

console.log("✅ Replacement completed.");
