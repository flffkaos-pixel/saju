// Saju algorithm extraction for syntax check
// This file mirrors the JS in index.html
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ANIMALS = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
const STEM_ELEMENTS = ['wood','wood','fire','fire','earth','earth','metal','metal','water','water'];
const STEM_YINYANG = ['yang','yin','yang','yin','yang','yin','yang','yin','yang','yin'];
const BRANCH_ELEMENTS = ['water','earth','wood','wood','earth','fire','fire','earth','metal','metal','earth','water'];
const HIDDEN_STEMS = [['癸'],['己','癸','辛'],['甲','丙','戊'],['乙'],['戊','乙','癸'],['丙','戊','庚'],['丁','己'],['己','丁','乙'],['庚','壬','戊'],['辛'],['戊','辛','丁'],['壬','甲']];
const HOUR_BRANCHES = [{range:'23:00–00:59',branch:0,animal:'Rat'},{range:'01:00–02:59',branch:1,animal:'Ox'},{range:'03:00–04:59',branch:2,animal:'Tiger'},{range:'05:00–06:59',branch:3,animal:'Rabbit'},{range:'07:00–08:59',branch:4,animal:'Dragon'},{range:'09:00–10:59',branch:5,animal:'Snake'},{range:'11:00–12:59',branch:6,animal:'Horse'},{range:'13:00–14:59',branch:7,animal:'Goat'},{range:'15:00–16:59',branch:8,animal:'Monkey'},{range:'17:00–18:59',branch:9,animal:'Rooster'},{range:'19:00–20:59',branch:10,animal:'Dog'},{range:'21:00–22:59',branch:11,animal:'Pig'}];

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
  if (dayOfYear < 5) branch = 0;
  else if (dayOfYear < 35) branch = 1;
  else if (dayOfYear < 65) branch = 2;
  else if (dayOfYear < 95) branch = 3;
  else if (dayOfYear < 126) branch = 4;
  else if (dayOfYear < 157) branch = 5;
  else if (dayOfYear < 188) branch = 6;
  else if (dayOfYear < 220) branch = 7;
  else if (dayOfYear < 251) branch = 8;
  else if (dayOfYear < 281) branch = 9;
  else if (dayOfYear < 311) branch = 10;
  else if (dayOfYear < 341) branch = 11;
  else branch = 0;
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
  if (hour < 0) return null;
  const branch = (hour === 23) ? 0 : Math.floor((hour + 1) / 2);
  const stem = (dayStem * 2 + branch) % 10;
  return { stem, branch };
}

function countElements(pillars) {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const slots = ['year','month','day','hour'];
  slots.forEach(key => {
    const p = pillars[key];
    if (!p) return;
    counts[STEM_ELEMENTS[p.stem]] += 1;
    counts[BRANCH_ELEMENTS[p.branch]] += 0.5;
    HIDDEN_STEMS[p.branch].forEach((hs, i) => {
      const idx = STEMS.indexOf(hs);
      const weight = i === 0 ? 0.7 : (i === 1 ? 0.3 : 0.15);
      counts[STEM_ELEMENTS[idx]] += weight;
    });
  });
  return counts;
}

// Smoke test
const result = {
  year: getYearPillar(2000, 6, 15),
  month: getMonthPillar(2000, 6, 15, getYearPillar(2000, 6, 15).stem),
  day: getDayPillar(2000, 6, 15),
  hour: getHourPillar(12, getDayPillar(2000, 6, 15).stem)
};
console.log('Smoke test:', JSON.stringify(result, null, 2));
console.log('Elements:', countElements(result));
