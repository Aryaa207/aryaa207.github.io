import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const projects = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(), shortTitle: z.string(), summary: z.string(), role: z.string(),
    period: z.string(), order: z.number(), lenses: z.array(z.enum(['gnc', 'cfd', 'embedded'])),
    tools: z.array(z.string()), status: z.string(), source: z.string(),
    missing: z.array(z.string()).default([]),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    visual: z.enum(['flow', 'drone', 'guidance', 'wing', 'car', 'capstone', 'aircraft']),
  }),
});
export const collections = { projects };
