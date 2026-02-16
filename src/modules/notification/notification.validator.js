import { z } from 'zod/v4';

export const fcmTokenSchema = z.object({
  body: z.object({
    token: z
      .string()
      .min(20, 'Push token is required')
      .refine(
        (token) => {
          // Accept both FCM tokens and Expo push tokens
          return (
            token.startsWith('ExponentPushToken[') || // Expo format
            /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+$/.test(token) || // FCM format (contains colon)
            /^[a-zA-Z0-9_-]{140,}$/.test(token) // FCM format (long alphanumeric)
          );
        },
        'Invalid push token format'
      ),
  }),
});

export const broadcastSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100, 'Title must be between 1 and 100 characters'),
    message: z.string().min(1).max(500, 'Message must be between 1 and 500 characters'),
    type: z.enum(['system', 'announcement', 'promotion', 'alert']).optional(),
  }),
});
