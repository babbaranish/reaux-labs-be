import { z } from 'zod/v4';

// These are all optional; a 0 (or a NaN that serialised to null) just means
// "not tracked for this exercise" and must not fail the whole workout. Coerce
// non-finite values to undefined, then allow 0.
const optionalNumber = z
  .preprocess(
    (v) => {
      if (v === '' || v === null) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    },
    z.number().min(0).optional()
  );

const optionalInt = z
  .preprocess(
    (v) => {
      if (v === '' || v === null) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? Math.trunc(n) : undefined;
    },
    z.number().min(0).optional()
  );

const exerciseSchema = z.object({
  name: z.string().min(1),
  sets: optionalInt,
  reps: optionalInt,
  weight: optionalNumber,
  duration: optionalNumber,
  restTime: optionalNumber,
  notes: z.string().optional(),
});

export const createWorkoutSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    category: z.enum(['strength', 'cardio', 'flexibility', 'hiit', 'yoga', 'crossfit', 'other']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    duration: optionalNumber,
    caloriesBurn: optionalNumber,
    exercises: z.array(exerciseSchema).optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateWorkoutSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional(),
    category: z.enum(['strength', 'cardio', 'flexibility', 'hiit', 'yoga', 'crossfit', 'other']).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    duration: optionalNumber,
    caloriesBurn: optionalNumber,
    exercises: z.array(exerciseSchema).optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  }),
});
