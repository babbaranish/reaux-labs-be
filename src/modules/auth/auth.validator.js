import { z } from 'zod/v4';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(6).max(128),
    phone: z.string().optional(),
    gymId: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(1),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
  }),
});
