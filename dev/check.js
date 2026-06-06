// Standalone JS check - reads index.html and extracts main script
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const re = /<script>([\s\S]*?)<\/script>/g;
let m, i = 0, found = [];
while ((m = re.exec(html)) !== null) {
  i++;
  if (m[1].length > 100) found.push({ i, body: m[1] });
}
console.log('Found', found.length, 'large script blocks');
// Try parsing the last big one (the main app code)
const code = found[found.length - 1].body;
// Use vm to parse
try {
  new Function(code);
  console.log('Main script parses OK');
} catch (e) {
  console.log('Parse error:', e.message);
  // Find line
  const lines = code.split('\n');
  console.log('Total lines:', lines.length);
}
