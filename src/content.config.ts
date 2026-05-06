import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localeEnum = z.enum(['pl', 'en']);
const slugRegex = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Realizacje — case studies for trade fair stands.
 * One file per case study, colocated under src/content/realizacje/<locale>/<slug>/index.mdx
 * with images in the same folder (Astro <Image> resolves relative paths).
 *
 * `canonicalSlug` ties PL ↔ EN versions of the same project together for hreflang.
 */
const realizacje = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './src/content/realizacje',
  }),
  schema: ({ image }) =>
    z.object({
      locale: localeEnum,
      title: z.string().min(3).max(120),
      client: z.string().min(1).max(120),
      // Public flag — set false if we don't have written consent to name the client
      clientPublic: z.boolean().default(true),
      fair: z.string().min(1).max(160),
      year: z.number().int().min(2010).max(2035),
      city: z.string().min(1).max(80),
      country: z.string().length(2).default('PL'), // ISO 3166-1 alpha-2
      area_m2: z.number().positive().max(2000),
      cover: image(),
      gallery: z.array(image()).min(1).max(40),
      excerpt: z.string().min(20).max(280),
      featured: z.boolean().default(false),
      featuredOrder: z.number().int().optional(),
      publishedAt: z.coerce.date(),
      canonicalSlug: z.string().regex(slugRegex), // shared across PL/EN
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

/**
 * Blog — MDX posts for SEO.
 * One file per post under src/content/blog/<locale>/<slug>.mdx
 */
const blog = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/blog',
  }),
  schema: ({ image }) =>
    z.object({
      locale: localeEnum,
      title: z.string().min(8).max(100),
      description: z.string().min(50).max(180), // SEO meta description
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().default('Strefa Expo'),
      ogImage: image().optional(),
      draft: z.boolean().default(false),
      canonicalSlug: z.string().regex(slugRegex), // ties PL↔EN versions
    }),
});

export const collections = { realizacje, blog };
