import { z } from 'zod';

export const createFarmSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Farm name is required').max(100),
    area: z.number().min(0, 'Area must be a non-negative number'),
    location: z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
    }),
    soil: z.object({
      nitrogen: z.number().min(0).max(1000),
      phosphorus: z.number().min(0).max(1000),
      potassium: z.number().min(0).max(1000),
      pH: z.number().min(0).max(14),
    }),
  }),
});

export const updateFarmSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    area: z.number().min(0).optional(),
    location: z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
    }).optional(),
    soil: z.object({
      nitrogen: z.number().min(0).max(1000),
      phosphorus: z.number().min(0).max(1000),
      potassium: z.number().min(0).max(1000),
      pH: z.number().min(0).max(14),
    }).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Farm ID is required'),
  }),
});

export const farmIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Farm ID is required'),
  }),
});
