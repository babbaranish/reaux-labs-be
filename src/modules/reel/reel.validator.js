import { z } from 'zod/v4';

export const createReelSchema = z.object({
  body: z.object({
    videoUrl: z.string().min(1),
    thumbnailUrl: z.string().optional(),
    caption: z.string().optional(),
    category: z.enum(['workout', 'nutrition', 'tips', 'motivation', 'other']).optional(),
    linkedProduct: z.string().optional(),
    productLink: z.string().optional(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1),
  }),
});
