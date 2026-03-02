import { z } from 'zod/v4';

export const recordBmiSchema = z.object({
  body: z.object({
    height: z.number().positive(),
    weight: z.number().positive(),
    age: z.number().int().positive().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
  }),
});
