import fs from 'node:fs';
import path from 'node:path';

const IMAGE_EXTENSIES = ['.jpg', '.jpeg', '.png', '.webp'];
const GEOPTIMALISEERD_DIR = path.join(process.cwd(), 'public', 'images-opt');

export interface ProjectFoto {
  src: string;
  alt: string;
}

function volgnummer(bestandsnaam: string): number {
  const match = bestandsnaam.match(/\((\d+)\)/);
  if (match) return parseInt(match[1], 10);
  // Bestanden zonder (nummer) horen achteraan, niet vooraan
  return Number.MAX_SAFE_INTEGER;
}

/**
 * Geeft het pad naar de geoptimaliseerde WebP-versie terug als die bestaat,
 * anders het pad naar het originele bestand. De mapnaam behoudt zijn slashes
 * (voor submappen zoals "Upcycle/eigen"); alleen de bestandsnaam wordt
 * ge-encodeerd zodat spaties en haakjes goed in de URL komen.
 */
function bepaalSrc(mapNaam: string, naam: string): string {
  const webpNaam = naam.replace(/\.(jpe?g|png)$/i, '.webp');
  const optPad = path.join(GEOPTIMALISEERD_DIR, mapNaam, webpNaam);

  if (fs.existsSync(optPad)) {
    return `/images-opt/${mapNaam}/${encodeURIComponent(webpNaam)}`;
  }
  return `/images/${mapNaam}/${encodeURIComponent(naam)}`;
}

/**
 * Leest alle afbeeldingen uit public/images/<mapNaam> in en geeft ze
 * gesorteerd terug (kaal bestand eerst, dan (1), (2), (3)...).
 * mapNaam mag ook een subpad zijn, bv. "Upcycle/eigen".
 */
export function leesProjectFotos(mapNaam: string, altPrefix: string): ProjectFoto[] {
  const dir = path.join(process.cwd(), 'public', 'images', mapNaam);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const bestanden = fs
    .readdirSync(dir)
    .filter((naam) => IMAGE_EXTENSIES.includes(path.extname(naam).toLowerCase()));

  bestanden.sort((a, b) => {
    const verschil = volgnummer(a) - volgnummer(b);
    if (verschil !== 0) return verschil;
    // Bij gelijk (of geen) nummer: alfabetisch, zodat de volgorde stabiel is
    return a.localeCompare(b);
  });

  return bestanden.map((naam, i) => ({
    src: bepaalSrc(mapNaam, naam),
    alt: `${altPrefix} - aanzicht ${i + 1}`,
  }));
}

/**
 * Bepaalt de thumbnail voor een project. Volgorde van voorrang:
 * 1. Een handmatig opgegeven bestandsnaam (data.thumbnail)
 * 2. De eerste foto uit de opgegeven map
 * 3. De eerste foto uit de eerste categorie-map (bij projecten met categorieën)
 */
export function bepaalThumbnail(data: {
  map?: string;
  categorieMappen?: { naam: string; map: string }[];
  thumbnail?: string;
  title: string;
}): string | null {
  if (data.thumbnail && data.map) {
    return bepaalSrc(data.map, data.thumbnail);
  }
  if (data.map) {
    const fotos = leesProjectFotos(data.map, data.title);
    return fotos[0]?.src ?? null;
  }
  if (data.categorieMappen && data.categorieMappen.length > 0) {
    const fotos = leesProjectFotos(data.categorieMappen[0].map, data.title);
    return fotos[0]?.src ?? null;
  }
  return null;
}
