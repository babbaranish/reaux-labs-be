import { z } from 'zod/v4';

export const fcmTokenSchema = z.object({
  body: z.object({
    token: z
      .string()
      .min(1, 'Push token is required')
      .refine(
        (token) => token.startsWith('ExponentPushToken[') && token.endsWith(']'),
        'Invalid Expo push token format. Expected: ExponentPushToken[xxx]'
      ),
  }),
});
