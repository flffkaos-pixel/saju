// Test lunar to solar conversion
const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,//1900-1909
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,//1910-1919
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,//1920-1929
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,//1930-1939
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,//1940-1949
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,//1950-1959
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,//1960-1969
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,//1970-1979
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,//1980-1989
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,//1990-1999
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,//2000-2009
];

function lunarToGregorian(year, month, day) {
  if (year < 1900 || year > 2099) return null;
  const info = LUNAR_INFO[year - 1900];
  const leapMonth = info & 0xf;
  const baseDate = new Date(1900, 0, 31);
  let offset = 0;
  for (let y = 1900; y < year; y++) {
    let dy = 0;
    const infoy = LUNAR_INFO[y - 1900];
    for (let m = 1; m <= 12; m++) dy += (infoy & (0x10000 >> m)) ? 30 : 29;
    if (infoy & 0xf) dy += (infoy & 0x10000) ? 30 : 29;
    offset += dy;
  }
  for (let m = 1; m < month; m++) {
    offset += (info & (0x10000 >> m)) ? 30 : 29;
    if (m === leapMonth) offset += (info & 0x10000) ? 30 : 29;
  }
  offset += (day - 1);
  const result = new Date(baseDate.getTime() + offset * 86400000);
  return { year: result.getFullYear(), month: result.getMonth() + 1, day: result.getDate() };
}

console.log('=== Lunar to Solar conversion tests ===\n');

// Reference: Korean Lunar New Year 2000 (Feb 5, 2000 solar)
// Lunar year 2000 month 1 day 1 = Feb 5, 2000 solar
const r1 = lunarToGregorian(2000, 1, 1);
console.log(`Lunar 2000-01-01 → Solar ${r1.year}-${r1.month}-${r1.day} (expected 2000-02-05)`);
console.log(`Match: ${r1.year === 2000 && r1.month === 2 && r1.day === 5 ? 'YES ✓' : 'NO ✗'}`);

// Reference: Korean Lunar New Year 1990 = Jan 27, 1990 solar
const r2 = lunarToGregorian(1990, 1, 1);
console.log(`Lunar 1990-01-01 → Solar ${r2.year}-${r2.month}-${r2.day} (expected 1990-01-27)`);
console.log(`Match: ${r2.year === 1990 && r2.month === 1 && r2.day === 27 ? 'YES ✓' : 'NO ✗'}`);

// Reference: Chuseok 2000 (Lunar 8th month 15th day) = Sep 12, 2000
// Wait, 2000 was leap year with 闰四月, so 8th month 15 = ?
const r3 = lunarToGregorian(2000, 8, 15);
console.log(`Lunar 2000-08-15 → Solar ${r3.year}-${r3.month}-${r3.day} (expected 2000-09-12)`);
console.log(`Match: ${r3.year === 2000 && r3.month === 9 && r3.day === 12 ? 'YES ✓' : 'NO ✗'}`);

// Reference: Lunar 1984-01-01 (Korean New Year 1984) = Feb 2, 1984
const r4 = lunarToGregorian(1984, 1, 1);
console.log(`Lunar 1984-01-01 → Solar ${r4.year}-${r4.month}-${r4.day} (expected 1984-02-02)`);
console.log(`Match: ${r4.year === 1984 && r4.month === 2 && r4.day === 2 ? 'YES ✓' : 'NO ✗'}`);

console.log('\n=== Lunar tests complete ===');
