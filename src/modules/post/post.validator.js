import { z } from 'zod/v4';

// Multipart bodies deliver arrays as a JSON string, so accept both shapes.
const stringArray = z.union([
  z.array(z.string()),
  z.string().transform((val) => {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Not JSON — fall through and treat it as a single value.
    }
    return val ? [val] : [];
  }),
]);

// A device-local path (file://, content://) only resolves on the phone that
// picked the image, so anything but an uploaded remote URL is rejected.
const remoteMediaUrl = z.string().refine((val) => /^https?:\/\//i.test(val), {
  message: 'mediaUrl must be a remote URL — upload the image as the "media" file field',
});

export const createPostSchema = z.object({
  body: z
    .object({
      content: z.string().optional(),
      mediaType: z.enum(['text', 'image', 'video']).optional(),
      mediaUrl: remoteMediaUrl.optional(),
      hashtags: stringArray.optional(),
      category: z.string().optional(),
    })
    .refine((body) => Boolean(body.content?.trim() || body.mediaUrl), {
      message: 'A post needs text content or media',
    }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1),
  }),
});
