import { z } from 'zod/v4';

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(['user', 'admin', 'superadmin']),
  }),
});

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'disabled']),
  }),
});
