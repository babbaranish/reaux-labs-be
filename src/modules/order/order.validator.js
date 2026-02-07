import { z } from 'zod/v4';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().min(1),
      phone: z.string().min(1),
    }),
    promoCode: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['confirmed', 'shipped', 'delivered', 'cancelled']),
  }),
});
