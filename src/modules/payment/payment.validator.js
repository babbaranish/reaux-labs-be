import { z } from 'zod/v4';

export const createRazorpayOrderSchema = z.object({
  body: z.object({
    orderId: z.string().min(1),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    signature: z.string().min(1),
  }),
});

export const markFailedSchema = z.object({
  body: z.object({
    orderId: z.string().min(1),
  }),
});
