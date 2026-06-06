// Smoke test: load index.html, parse it, render one chart, check output
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Extract constants and key functions
const re = /<script>([\s\S]*?)<\/script>/g;
let m, code;
while ((m = re.exec(html)) !== null) {
  if (m[1].length > 1000) { code = m[1]; break; }
}

// Mock the DOM elements the script expects
global.document = {
  getElementById: () => ({ addEventListener: () => {}, scrollIntoView: () => {}, classList: { add: () => {}, remove: () => {} }, value: '', style: {} })
};

// Extract the data and function pieces we need
const extractedCode = code
  .replace(/document\.getElementById[^;]+;/g, '/* dom */;')
  .replace(/document\.getElementById\([^)]+\)\.addEventListener[\s\S]*?\}\);/g, '/* listener */;')
  .replace(/document\.getElementById\([^)]+\)\.textContent[^;]+;/g, '/* yr */;');

try {
  // We can't fully execute because of DOM dependencies, but we can extract DAY_MASTER
  const dmMatch = code.match(/const DAY_MASTER = (\{[\s\S]*?^\};)/m);
  if (dmMatch) {
    // We need to evaluate just the DAY_MASTER constant
    const dmCode = 'const DAY_MASTER = ' + dmMatch[1] + '\n;DAY_MASTER';
    const DAY_MASTER = eval(dmCode);
    console.log('=== Day Master content stats ===');
    for (let i = 0; i < 10; i++) {
      const d = DAY_MASTER[i];
      const descLen = d.description.length;
      const loveLen = d.love.length;
      const careerLen = d.career.length;
      const wealthLen = d.wealth.length;
      const total = descLen + loveLen + careerLen + wealthLen;
      console.log(`  ${i}. ${d.name.padEnd(12)} desc=${descLen}c love=${loveLen}c career=${careerLen}c wealth=${wealthLen}c TOTAL=${total}c`);
    }
  }
  const branchMatch = code.match(/const BRANCH_INFO = (\{[\s\S]*?^\};)/m);
  if (branchMatch) {
    const BRANCH_INFO = eval('const BRANCH_INFO = ' + branchMatch[1] + '\n;BRANCH_INFO');
    console.log('\n=== Branch info trait lengths ===');
    for (let i = 0; i < 12; i++) {
      const b = BRANCH_INFO[i];
      console.log(`  ${i}. ${b.animal.padEnd(8)}: ${b.trait.length} chars`);
    }
  }
} catch (e) {
  console.log('Error:', e.message);
}
