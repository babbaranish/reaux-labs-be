import { z } from 'zod/v4';

export const fcmTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'FCM token is required'),
  }),
});
