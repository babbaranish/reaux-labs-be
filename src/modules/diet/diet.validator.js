import { z } from 'zod/v4';

const mealItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().optional(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
});

const mealSchema = z.object({
  name: z.string().min(1),
  time: z.string().optional(),
  items: z.array(mealItemSchema).optional(),
});

export const createDietSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    category: z.enum(['weight-loss', 'muscle-gain', 'maintenance', 'keto', 'vegan', 'other']),
    description: z.string().max(2000).optional(),
    meals: z.array(mealSchema).optional(),
    image: z.string().optional(),
    totalCalories: z.number().positive().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const updateDietSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    category: z.enum(['weight-loss', 'muscle-gain', 'maintenance', 'keto', 'vegan', 'other']).optional(),
    description: z.string().max(2000).optional(),
    meals: z.array(mealSchema).optional(),
    image: z.string().optional(),
    totalCalories: z.number().positive().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  }),
});
