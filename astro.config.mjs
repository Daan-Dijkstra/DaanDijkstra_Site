import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { optimizeImages } from './scripts/optimize-images.mjs';

// Eigen integratie voor beeldoptimalisatie, met alle lifecycle-hooks
// netjes gedefinieerd zodat andere integraties (zoals sitemap) correct
// blijven werken.
function beeldoptimalisatie() {
  return {
    name: 'dd-beeldoptimalisatie',
    hooks: {
      'astro:build:start': async () => {
        await optimizeImages();
      },
      'astro:server:setup': async () => {
        await optimizeImages();
      },
    },
  };
}

export default defineConfig({
  site: 'https://daandijkstra.com',
  integrations: [beeldoptimalisatie(), sitemap()],
});
