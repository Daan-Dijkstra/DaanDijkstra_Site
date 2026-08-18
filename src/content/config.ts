import { defineCollection, z } from 'astro:content';

const projecten = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    beschrijving: z.string(),
    volgorde: z.number().default(99),
    // Naam van de map onder public/images/ waar alle foto's van dit
    // project in staan (exact zoals op schijf, hoofdletters tellen mee).
    map: z.string().optional(),
    // Optioneel: specifieke bestandsnaam (binnen de map hierboven) die als
    // tegel/thumbnail gebruikt moet worden. Zonder dit veld wordt gewoon de
    // eerste foto uit de map gebruikt.
    thumbnail: z.string().optional(),
    // Voor projecten met meerdere categorieën (zoals Up-Cycle): elke
    // categorie heeft een eigen naam en een eigen map.
    categorieMappen: z
      .array(
        z.object({
          naam: z.string(),
          map: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { projecten };
