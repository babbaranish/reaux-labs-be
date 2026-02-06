import { z } from 'zod/v4';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    mediaType: z.enum(['text', 'image', 'video']).optional(),
    mediaUrl: z.string().optional(),
    hashtags: z.array(z.string()).optional(),
    category: z.string().optional(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1),
  }),
});
