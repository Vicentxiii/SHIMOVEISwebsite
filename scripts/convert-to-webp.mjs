import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const files = [
  'src/assets/images/cliffside_villa_hero_1783897988616.jpg',
  'src/assets/images/logo_transparente.png',
  'src/assets/images/luxury_mansion_joatinga_1783898026904.jpg',
  'src/assets/images/sao_paulo_penthouse_1783898008439.jpg',
  'src/assets/images/silvia_helena_portrait_3.png',
  'src/assets/images/trancoso_beach_house_1783898016790.jpg',
  'public/favicon.png',
  'public/og-image.png',
  'public/og-image.jpg',
  'favicon.png',
];

let totalOrig = 0;
let totalWebp = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`SKIP not found: ${file}`);
    continue;
  }
  const ext = path.extname(file);
  const webpPath = file.replace(/\.(png|jpg|jpeg|JPG|PNG)$/, '.webp');
  // For jpg source that is public/og-image.jpg -> should become og-image.webp (same base)
  // Use sharp
  const origStat = fs.statSync(file);
  totalOrig += origStat.size;
  try {
    const isPng = ext.toLowerCase() === '.png';
    // Use quality 82 for high visual quality, effort 6 for good compression
    // For PNG with transparency (logo), use lossless false but nearLossless? Use quality 85
    await sharp(file)
      .webp({ quality: isPng ? 85 : 82, effort: 6, alphaQuality: 85 })
      .toFile(webpPath);
    const webpStat = fs.statSync(webpPath);
    totalWebp += webpStat.size;
    const saved = origStat.size - webpStat.size;
    const pct = ((saved / origStat.size) * 100).toFixed(1);
    console.log(`${file} -> ${webpPath} | ${(origStat.size/1024).toFixed(1)}KB -> ${(webpStat.size/1024).toFixed(1)}KB | saved ${pct}%`);
  } catch (e) {
    console.error(`Failed ${file}:`, e.message);
  }
}

console.log(`\nTOTAL: ${(totalOrig/1024/1024).toFixed(2)} MB -> ${(totalWebp/1024/1024).toFixed(2)} MB | saved ${((totalOrig-totalWebp)/1024/1024).toFixed(2)} MB (${(((totalOrig-totalWebp)/totalOrig)*100).toFixed(1)}%)`);

// Also handle duplicate: ensure src/assets images have both .jpg and .webp etc.
// We already handled.

// Extra: verify silvia portrait specifically
const portraitOrig = 'src/assets/images/silvia_helena_portrait_3.png';
const portraitWebp = 'src/assets/images/silvia_helena_portrait_3.webp';
if (fs.existsSync(portraitOrig) && fs.existsSync(portraitWebp)) {
  const o = fs.statSync(portraitOrig).size;
  const w = fs.statSync(portraitWebp).size;
  console.log(`\nPortrait detail: ${(o/1024/1024).toFixed(2)} MB -> ${(w/1024/1024).toFixed(2)} MB | saved ${(((o-w)/o)*100).toFixed(1)}%`);
}
