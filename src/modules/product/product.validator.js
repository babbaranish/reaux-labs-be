import { z } from 'zod/v4';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    description: z.string().optional(),
    compareAtPrice: z.number().positive().optional(),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
    stock: z.number().int().min(0).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    description: z.string().optional(),
    compareAtPrice: z.number().positive().optional(),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
    stock: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});
