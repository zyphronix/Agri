import { z } from 'zod';

export const recommendationSchema = z.object({
  body: z.object({
    farmId: z.string().min(1, 'Farm ID is required'),
  }),
});
