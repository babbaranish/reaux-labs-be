import { z } from 'zod/v4';

export const createPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Plan name is required'),
    gymId: z.string().min(1, 'Gym ID is required'),
    durationDays: z.number().int().positive('Duration must be a positive number'),
    price: z.number().positive('Price must be a positive number'),
    features: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
});

export const updatePlanSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    durationDays: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
    features: z.array(z.string()).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const assignMembershipSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    planId: z.string().min(1, 'Plan ID is required'),
    startDate: z.string().optional(),
  }),
});
