import { defineConfig } from 'astro/config';
import { optimizeImages } from './scripts/optimize-images.mjs';

export default defineConfig({
  site: 'https://daandijkstra.com',
  integrations: [
    {
      name: 'dd-beeldoptimalisatie',
      hooks: {
        // Draait vlak voordat de site gebouwd wordt (ook op Vercel)
        'astro:build:start': async () => {
          await optimizeImages();
        },
        // Draait bij het starten van de lokale preview (npm run dev)
        'astro:server:setup': async () => {
          await optimizeImages();
        },
      },
    },
  ],
});
