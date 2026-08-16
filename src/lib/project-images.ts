import fs from 'node:fs';
import path from 'node:path';

const IMAGE_EXTENSIES = ['.jpg', '.jpeg', '.png', '.webp'];

export interface ProjectFoto {
  src: string;
  alt: string;
}

function volgnummer(bestandsnaam: string): number {
  const match = bestandsnaam.match(/\((\d+)\)/);
  if (match) return parseInt(match[1], 10);
  return 0;
}

/**
 * Leest alle afbeeldingen uit public/images/<mapNaam> in en geeft ze
 * gesorteerd terug (kaal bestand eerst, dan (1), (2), (3)...).
 * mapNaam mag ook een subpad zijn, bv. "Upcycle/eigen".
 * Hoofdletters in mapnaam en bestandsextensie (.jpg vs .JPG) worden
 * ondersteund zoals ze op schijf staan.
 */
export function leesProjectFotos(mapNaam: string, altPrefix: string): ProjectFoto[] {
  const dir = path.join(process.cwd(), 'public', 'images', mapNaam);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const bestanden = fs
    .readdirSync(dir)
    .filter((naam) => IMAGE_EXTENSIES.includes(path.extname(naam).toLowerCase()));

  bestanden.sort((a, b) => volgnummer(a) - volgnummer(b));

  return bestanden.map((naam, i) => ({
    src: `/images/${mapNaam}/${encodeURIComponent(naam)}`,
    alt: `${altPrefix} - aanzicht ${i + 1}`,
  }));
}

/**
 * Bepaalt de thumbnail voor een project: de eerste foto uit de opgegeven
 * map, of de eerste foto uit de eerste categorie-map als het project
 * categorieën gebruikt.
 */
export function bepaalThumbnail(data: {
  map?: string;
  categorieMappen?: { naam: string; map: string }[];
  title: string;
}): string | null {
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
