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
