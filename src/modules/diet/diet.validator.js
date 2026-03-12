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

// Helper: parse JSON string or pass through array (for multipart form data support)
const jsonArrayOrArray = (itemSchema) =>
  z.union([
    z.array(itemSchema),
    z.string().transform((val) => JSON.parse(val)).pipe(z.array(itemSchema)),
  ]);

// Helper: boolean that also accepts string "true"/"false" (multipart form data)
const coerceBool = z.union([
  z.boolean(),
  z.string().transform((val) => val === 'true'),
]);

export const createDietSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    category: z.enum(['weight-loss', 'muscle-gain', 'bulking', 'cutting', 'other']),
    dietType: z.enum(['veg', 'non-veg', 'both']).optional(),
    description: z.string().max(2000).optional(),
    meals: jsonArrayOrArray(mealSchema).optional(),
    image: z.string().optional(),
    totalCalories: z.coerce.number().positive().optional(),
    tags: jsonArrayOrArray(z.string()).optional(),
    isPublished: coerceBool.optional(),
  }),
});

export const updateDietSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    category: z.enum(['weight-loss', 'muscle-gain', 'bulking', 'cutting', 'other']).optional(),
    dietType: z.enum(['veg', 'non-veg', 'both']).optional(),
    description: z.string().max(2000).optional(),
    meals: jsonArrayOrArray(mealSchema).optional(),
    image: z.string().optional(),
    totalCalories: z.coerce.number().positive().optional(),
    tags: jsonArrayOrArray(z.string()).optional(),
    isPublished: coerceBool.optional(),
  }),
});
