import { z } from 'zod/v4';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive().default(1).optional(),
    flavour: z.string().optional(),
  }),
});

export const removeFromCartSchema = z.object({
  params: z.object({
    productId: z.string().min(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    productId: z.string().min(1),
  }),
  body: z.object({
    quantity: z.number().int(),
    flavour: z.string().optional(),
  }),
});
