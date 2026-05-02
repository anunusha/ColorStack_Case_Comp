/**
 * Report Hindi keys missing in translations.json vs English.
 * Run: node scripts/check-translations.js
 */
const fs = require("fs");
const path = require("path");

const translations = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/translations.json"), "utf8")
);

const enKeys = Object.keys(translations.en ?? {});
const hi = translations.hi ?? {};
const missing = enKeys.filter((k) => hi[k] == null || hi[k] === "");

console.log(`English keys: ${enKeys.length}`);
console.log(`Hindi keys: ${Object.keys(hi).length}`);
console.log(`Missing or empty Hindi: ${missing.length}`);

if (missing.length) {
  missing.forEach((k) => {
    console.log(`  - ${k}: "${translations.en[k]}"`);
  });
  process.exitCode = 1;
}
