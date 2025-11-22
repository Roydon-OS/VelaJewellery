/**
 * Run with: node scripts/generate_manifest.js
 * Scans ./images/<category> folders and writes ./images.json
 */
const fs = require("fs");
const path = require("path");
const IMAGES_DIR = path.join(__dirname, "..", "images");
const OUT_FILE = path.join(__dirname, "..", "images.json");

function isImage(f) {
  return /\.(jpe?g|png|webp|gif|svg)$/i.test(f);
}

if (!fs.existsSync(IMAGES_DIR)) {
  console.error(
    "images directory not found. Create images/ with subfolders (rings, necklaces, etc.)"
  );
  process.exit(1);
}

const categories = fs
  .readdirSync(IMAGES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
let out = [];
for (const cat of categories) {
  const catDir = path.join(IMAGES_DIR, cat);
  const files = fs.readdirSync(catDir).filter(isImage);
  for (const f of files) {
    out.push({
      src: `images/${cat}/${f}`,
      category: cat,
      alt: `${cat} - ${f.replace(/[-_0-9]+/g, " ").replace(/\.\w+$/, "")}`,
    });
  }
}
fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));
console.log(`Wrote ${out.length} entries to images.json`);
