import { z } from 'zod/v4';

export const createChallengeSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    type: z.enum(['steps', 'workout', 'diet', 'custom']),
    target: z.number().positive(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    description: z.string().optional(),
  }),
});
