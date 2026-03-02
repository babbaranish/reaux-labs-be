import { z } from 'zod/v4';

const exerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.coerce.number().int().positive().optional(),
  reps: z.coerce.number().int().positive().optional(),
  weight: z.coerce.number().min(0).optional(),
  duration: z.coerce.number().positive().optional(),
  restTime: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export const createWorkoutSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    category: z.enum(['strength', 'cardio', 'flexibility', 'hiit', 'yoga', 'crossfit', 'other']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    duration: z.coerce.number().positive().optional(),
    caloriesBurn: z.coerce.number().positive().optional(),
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
    duration: z.coerce.number().positive().optional(),
    caloriesBurn: z.coerce.number().positive().optional(),
    exercises: z.array(exerciseSchema).optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  }),
});
