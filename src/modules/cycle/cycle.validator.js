import { z } from 'zod/v4';

const compoundSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
});

const phaseSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  note: z.string().optional(),
  compounds: z.array(compoundSchema).optional(),
});

const pctItemSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().optional(),
  duration: z.string().optional(),
});

const pctSchema = z.object({
  startNote: z.string().optional(),
  items: z.array(pctItemSchema).optional(),
});

const riskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

// Helper: parse JSON string or pass through array (for multipart form data support)
const jsonArrayOrArray = (itemSchema) =>
  z.union([
    z.array(itemSchema),
    z.string().transform((val) => JSON.parse(val)).pipe(z.array(itemSchema)),
  ]);

// Helper: parse JSON string or pass through object (for multipart form data support)
const jsonObjectOrObject = (objSchema) =>
  z.union([
    objSchema,
    z.string().transform((val) => JSON.parse(val)).pipe(objSchema),
  ]);

// Helper: boolean that also accepts string "true"/"false" (multipart form data)
const coerceBool = z.union([
  z.boolean(),
  z.string().transform((val) => val === 'true'),
]);

// Optional numeric value: blank/NaN becomes undefined instead of failing; 0 allowed.
const optionalNumber = z.preprocess((v) => {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}, z.number().min(0).optional());

export const createCycleSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    category: z.enum(['bulking', 'cutting', 'recomp', 'pct', 'other']),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    type: z.enum(['oral', 'injectable', 'inj-oral']).optional(),
    description: z.string().max(2000).optional(),
    durationWeeks: optionalNumber,
    estimatedGain: z.string().max(100).optional(),
    image: z.string().optional(),
    phases: jsonArrayOrArray(phaseSchema).optional(),
    pct: jsonObjectOrObject(pctSchema).optional(),
    risks: jsonArrayOrArray(riskSchema).optional(),
    tags: jsonArrayOrArray(z.string()).optional(),
    isPublished: coerceBool.optional(),
  }),
});

export const updateCycleSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    category: z.enum(['bulking', 'cutting', 'recomp', 'pct', 'other']).optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    type: z.enum(['oral', 'injectable', 'inj-oral']).optional(),
    description: z.string().max(2000).optional(),
    durationWeeks: optionalNumber,
    estimatedGain: z.string().max(100).optional(),
    image: z.string().optional(),
    phases: jsonArrayOrArray(phaseSchema).optional(),
    pct: jsonObjectOrObject(pctSchema).optional(),
    risks: jsonArrayOrArray(riskSchema).optional(),
    tags: jsonArrayOrArray(z.string()).optional(),
    isPublished: coerceBool.optional(),
  }),
});
