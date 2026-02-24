import { z } from 'zod/v4';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(6).max(128),
    phone: z.string().optional(),
    role: z.enum(['user', 'admin', 'superadmin']).default('user'),
    gymId: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    status: z.enum(['active', 'disabled']).default('active'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    role: z.enum(['user', 'admin', 'superadmin']).optional(),
    gymId: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    status: z.enum(['active', 'disabled']).optional(),
  }),
});

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
