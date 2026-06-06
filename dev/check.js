// Use vm.Script to get line info
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const re = /<script>([\s\S]*?)<\/script>/g;
let m, code;
while ((m = re.exec(html)) !== null) {
  if (m[1].length > 1000) { code = m[1]; break; }
}
try {
  new vm.Script(code);
  console.log('OK');
} catch (e) {
  console.log('Error:', e.message);
  console.log('Stack:', e.stack);
  // try to find line
  const lines = code.split('\n');
  // Look for likely problem tokens near keyword
  if (e.message.includes("'s'")) {
    // Find lines with unescaped apostrophes
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/[^\\]'(s|t|re|ve|ll|d|m)\b/)) {
        console.log('Possible apostrophe issue line ' + (i+1) + ': ' + lines[i].substring(0, 200));
      }
    }
  }
}
