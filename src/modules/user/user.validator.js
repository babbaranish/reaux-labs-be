import { z } from 'zod/v4';

const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
  .optional();

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    email: z.email(),
    password: z.string().min(6).max(128),
    phone: phoneSchema,
    role: z.enum(['user', 'admin', 'superadmin']).default('user'),
    gymId: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    dateOfJoining: z.string().optional(),
    status: z.enum(['active', 'disabled']).default('active'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: phoneSchema,
    role: z.enum(['user', 'admin', 'superadmin']).optional(),
    gymId: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    dateOfJoining: z.string().optional(),
    status: z.enum(['active', 'disabled']).optional(),
  }),
});

export const savedAddressSchema = z.object({
  body: z.object({
    label: z.string().min(1).max(50).optional(),
    street: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits').optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const updateSavedAddressSchema = z.object({
  body: z.object({
    label: z.string().min(1).max(50).optional(),
    street: z.string().min(1).max(200).optional(),
    city: z.string().min(1).max(100).optional(),
    state: z.string().min(1).max(100).optional(),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional(),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits').optional(),
    isDefault: z.boolean().optional(),
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
