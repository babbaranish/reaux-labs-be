import { z } from 'zod/v4';

const nutritionSchema = z.object({
  servingSize: z.string().optional(),
  calories: z.coerce.number().min(0).optional(),
  protein: z.coerce.number().min(0).optional(),
  carbs: z.coerce.number().min(0).optional(),
  fat: z.coerce.number().min(0).optional(),
  sugar: z.coerce.number().min(0).optional(),
}).optional();

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    price: z.coerce.number().positive(),
    description: z.string().optional(),
    compareAtPrice: z.coerce.number().positive().optional(),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    nutrition: nutritionSchema,
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    price: z.coerce.number().positive().optional(),
    description: z.string().optional(),
    compareAtPrice: z.coerce.number().positive().optional(),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    nutrition: nutritionSchema,
    isActive: z.boolean().optional(),
  }),
});
