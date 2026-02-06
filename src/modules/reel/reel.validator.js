import { z } from 'zod/v4';

export const createReelSchema = z.object({
  body: z.object({
    videoUrl: z.string().min(1),
    caption: z.string().optional(),
    linkedProduct: z.string().optional(),
  }),
});
