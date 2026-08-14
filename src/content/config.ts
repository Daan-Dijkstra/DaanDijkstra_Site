import { defineCollection, z } from 'astro:content';

const projecten = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    thumbnail: z.string(),
    beschrijving: z.string(),
    fotos: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
      })
    ),
    volgorde: z.number().default(99),
  }),
});

export const collections = { projecten };
