// Saju algorithm verification test
// Run with: node test-saju.js

const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ANIMALS = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
const STEM_ELEMENTS = ['wood','wood','fire','fire','earth','earth','metal','metal','water','water'];
const BRANCH_ELEMENTS = ['water','earth','wood','wood','earth','fire','fire','earth','metal','metal','earth','water'];
const HIDDEN_STEMS = [
  ['癸'], ['己','癸','辛'], ['甲','丙','戊'], ['乙'],
  ['戊','乙','癸'], ['丙','戊','庚'], ['丁','己'], ['己','丁','乙'],
  ['庚','壬','戊'], ['辛'], ['戊','辛','丁'], ['壬','甲']
];

function gregorianToJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getYearPillar(year, month, day) {
  let sajuYear = year;
  if (month < 2 || (month === 2 && day < 4)) sajuYear -= 1;
  const stem = ((sajuYear - 4) % 10 + 10) % 10;
  const branch = ((sajuYear - 4) % 12 + 12) % 12;
  return { stem, branch };
}

function getMonthPillar(year, month, day, yearStem) {
  const date = new Date(year, month - 1, day);
  const start = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date - start) / 86400000) + 1;
  let branch;
  if (dayOfYear < 5)        branch = 0;
  else if (dayOfYear < 35)  branch = 1;
  else if (dayOfYear < 65)  branch = 2;
  else if (dayOfYear < 95)  branch = 3;
  else if (dayOfYear < 126) branch = 4;
  else if (dayOfYear < 157) branch = 5;
  else if (dayOfYear < 188) branch = 6;
  else if (dayOfYear < 220) branch = 7;
  else if (dayOfYear < 251) branch = 8;
  else if (dayOfYear < 281) branch = 9;
  else if (dayOfYear < 311) branch = 10;
  else if (dayOfYear < 341) branch = 11;
  else                       branch = 0;
  const stem = (yearStem * 2 + branch) % 10;
  return { stem, branch };
}

function getDayPillar(year, month, day) {
  const jdn = gregorianToJDN(year, month, day);
  const stem = ((jdn - 11) % 10 + 10) % 10;
  const branch = ((jdn + 1) % 12 + 12) % 12;
  return { stem, branch };
}

function getHourPillar(hour, dayStem) {
  const branch = (hour === 23) ? 0 : Math.floor((hour + 1) / 2);
  const stem = (dayStem * 2 + branch) % 10;
  return { stem, branch };
}

function calc(y, m, d, h) {
  const yp = getYearPillar(y, m, d);
  const mp = getMonthPillar(y, m, d, yp.stem);
  const dp = getDayPillar(y, m, d);
  const hp = h >= 0 ? getHourPillar(h, dp.stem) : null;
  return { year: yp, month: mp, day: dp, hour: hp };
}

function fmt(p) {
  if (!p) return '??';
  return STEMS[p.stem] + BRANCHES[p.branch];
}

function show(label, y, m, d, h) {
  const p = calc(y, m, d, h);
  const yearAnimal = ANIMALS[p.year.branch];
  const dayAnimal = ANIMALS[p.day.branch];
  const dayElem = STEM_ELEMENTS[p.day.stem];
  console.log(`${label}: ${y}-${m}-${d} ${h}:00`);
  console.log(`  Year:  ${fmt(p.year)} (${yearAnimal})`);
  console.log(`  Month: ${fmt(p.month)}`);
  console.log(`  Day:   ${fmt(p.day)} (${dayAnimal}) — ${dayElem} Day Master`);
  console.log(`  Hour:  ${p.hour ? fmt(p.hour) : 'unknown'}`);
  console.log('');
}

console.log('=== Saju Algorithm Tests ===\n');
console.log('--- Reference dates (verified from public 만세력) ---\n');

// Reference 1: Jan 1, 2000 = 戊午 day (verified)
show('Test 1 (Jan 1 2000 noon)', 2000, 1, 1, 12);
// Expected: Year 己卯 (1999 saju year since Jan 1 is before Feb 4), Month 甲子, Day 戊午, Hour 戊午

// Reference 2: 1984-02-04 should be 甲子 year, 丙寅 month
show('Test 2 (Feb 4 1984 = 입춘)', 1984, 2, 4, 12);
// Expected: Year 甲子, Month 丙寅, ...

// Reference 3: 2000-12-31 - last day before 2001
show('Test 3 (Dec 31 2000)', 2000, 12, 31, 23);

// Reference 4: Year 1984 = 甲子
show('Test 4 (any date in 1984 after Feb 4)', 1984, 6, 15, 10);
// Year should be 甲子

// Reference 5: A known case - Steve Jobs (Feb 24, 1955, ~19:30)
show('Test 5 (Steve Jobs birth)', 1955, 2, 24, 19);

// Reference 6: Year 2008 = 戊子 (Rat)
show('Test 6 (any date in 2008)', 2008, 5, 1, 12);

// Reference 7: Year 2024 = 甲辰 (Dragon)
show('Test 7 (any date in 2024)', 2024, 7, 15, 9);

// Reference 8: Day pillar continuity test
console.log('--- Day Pillar continuity (should increment by 1 each day) ---');
const baseDay = calc(2000, 1, 1, 12).day;
console.log(`Base: 2000-01-01 = ${fmt(baseDay)}`);
for (let i = 1; i <= 5; i++) {
  const d = new Date(2000, 0, 1 + i);
  const p = calc(d.getFullYear(), d.getMonth()+1, d.getDate(), 12).day;
  console.log(`  +${i} day (${d.toISOString().slice(0,10)}): ${fmt(p)}`);
}
console.log('');

// Reference 9: 60-cycle (sexagenary) test
console.log('--- 60-cycle test (should wrap after 60 days) ---');
const start = calc(2000, 1, 1, 12).day;
const idxStart = start.stem * 12 + start.branch * 10 - (10-1) * 12;  // hmm complex
// Simpler: just check Jan 1 2000 vs Jan 1 2000 + 60 days
const d1 = fmt(calc(2000, 1, 1, 12).day);
const d60 = fmt(calc(2000, 3, 1, 12).day);  // Jan has 31 days, Feb 2000 has 29, so 31+29 = 60 days from Jan 1 = Mar 1
console.log(`Jan 1, 2000 = ${d1}`);
console.log(`Mar 1, 2000 (+60 days) = ${d60}`);
console.log(`Match: ${d1 === d60 ? 'YES ✓' : 'NO ✗'}`);
console.log('');

// Reference 10: 입춘 boundary test
console.log('--- 입춘 boundary (Feb 4 cutoff) ---');
const feb3 = calc(1984, 2, 3, 12);
const feb4 = calc(1984, 2, 4, 12);
console.log(`Feb 3, 1984 year pillar: ${fmt(feb3.year)}`);
console.log(`Feb 4, 1984 year pillar: ${fmt(feb4.year)}`);
console.log(`Year should change between them: ${fmt(feb3.year) !== fmt(feb4.year) ? 'YES ✓' : 'NO ✗'}`);

console.log('\n=== Tests complete ===');
