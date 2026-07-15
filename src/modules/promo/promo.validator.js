import { z } from 'zod/v4';

export const createPromoSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().positive(),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
  }),
});

export const updatePromoSchema = z.object({
  body: z.object({
    code: z.string().min(1).optional(),
    discountType: z.enum(['percentage', 'fixed']).optional(),
    discountValue: z.number().positive().optional(),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const validatePromoSchema = z.object({
  body: z.object({
    code: z.string().min(1),
  }),
});
