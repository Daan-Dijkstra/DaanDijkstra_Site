import { defineCollection, z } from 'astro:content';

const foto = z.object({
  src: z.string(),
  alt: z.string(),
});

const projecten = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    thumbnail: z.string(),
    beschrijving: z.string(),
    fotos: z.array(foto).optional().default([]),
    categorieen: z
      .array(
        z.object({
          naam: z.string(),
          fotos: z.array(foto),
        })
      )
      .optional(),
    volgorde: z.number().default(99),
  }),
});

export const collections = { projecten };
