import { z } from 'zod/v4';

export const submitContactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  }),
});
