import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const BRON = 'public/images';
const DOEL = 'public/images-opt';
const MAX_BREEDTE = 1600; // ruim genoeg voor de lightbox op groot scherm
const KWALITEIT = 78; // webp-kwaliteit; 78 is visueel vrijwel verliesloos
const EXTENSIES = new Set(['.jpg', '.jpeg', '.png']);

async function loopMapDoor(dir) {
  const items = await readdir(dir, { withFileTypes: true });
  const bestanden = [];
  for (const item of items) {
    const vol = path.join(dir, item.name);
    if (item.isDirectory()) {
      bestanden.push(...(await loopMapDoor(vol)));
    } else {
      bestanden.push(vol);
    }
  }
  return bestanden;
}

/**
 * Comprimeert alle foto's in public/images/ en schrijft geoptimaliseerde
 * WebP-versies naar public/images-opt/, met dezelfde mapstructuur.
 * Slaat bestanden over die al up-to-date zijn.
 */
export async function optimizeImages() {
  if (!existsSync(BRON)) {
    return;
  }

  const bestanden = await loopMapDoor(BRON);
  let gedaan = 0;
  let overgeslagen = 0;

  for (const bron of bestanden) {
    const ext = path.extname(bron).toLowerCase();
    if (!EXTENSIES.has(ext)) continue;

    const rel = path.relative(BRON, bron);
    const doelRel = rel.replace(/\.(jpe?g|png)$/i, '.webp');
    const doel = path.join(DOEL, doelRel);

    // Overslaan als de geoptimaliseerde versie al bestaat en niet ouder is
    if (existsSync(doel)) {
      const [bronStat, doelStat] = await Promise.all([stat(bron), stat(doel)]);
      if (doelStat.mtimeMs >= bronStat.mtimeMs) {
        overgeslagen++;
        continue;
      }
    }

    await mkdir(path.dirname(doel), { recursive: true });
    await sharp(bron)
      .rotate() // corrigeer stand op basis van EXIF (voorkomt gedraaide foto's)
      .resize({ width: MAX_BREEDTE, withoutEnlargement: true })
      .webp({ quality: KWALITEIT })
      .toFile(doel);
    gedaan++;
  }

  console.log(
    `[beeldoptimalisatie] ${gedaan} gecomprimeerd, ${overgeslagen} overgeslagen (al up-to-date)`
  );
}

// Maakt het mogelijk het script ook los te draaien met: node scripts/optimize-images.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages();
}
