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
    feesAmount: z.number().min(0).optional(),
    feesPaid: z.number().min(0).optional(),
  }),
});

export const recordFeesSchema = z.object({
  body: z.object({
    amount: z.number().refine((n) => n !== 0, { message: 'Amount cannot be zero' }),
    note: z.string().optional(),
  }),
});

export const applyCreditSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    note: z.string().optional(),
  }),
});

export const adjustFeesSchema = z.object({
  body: z.object({
    feesAmount: z.number().min(0).optional(),
    feesPaid: z.number().min(0).optional(),
    advanceCredit: z.number().min(0).optional(),
    note: z.string().optional(),
  }).refine(
    (d) => d.feesAmount !== undefined || d.feesPaid !== undefined || d.advanceCredit !== undefined,
    { message: 'At least one field (feesAmount, feesPaid, advanceCredit) is required' }
  ),
});
