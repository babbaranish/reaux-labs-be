import { z } from 'zod/v4';

// Optional numeric value: blank/NaN → undefined (multipart form data); 0 allowed.
const optionalNumber = z.preprocess((v) => {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}, z.number().min(0).optional());

export const createCandidateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    phone: z.string().min(1).max(20),
    monthlyFees: optionalNumber,
    startDate: z.string().optional(),
    avatar: z.string().optional(),
    gymId: z.string().optional(),
  }),
});

const dayHoursSchema = z
  .object({
    open: z.string(),
    close: z.string(),
  })
  .optional();

export const createGymSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().min(1),
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
    }),
    phone: z.string().optional(),
    email: z.email().optional(),
    amenities: z.array(z.string()).optional(),
    openingHours: z
      .object({
        monday: dayHoursSchema,
        tuesday: dayHoursSchema,
        wednesday: dayHoursSchema,
        thursday: dayHoursSchema,
        friday: dayHoursSchema,
        saturday: dayHoursSchema,
        sunday: dayHoursSchema,
      })
      .optional(),
  }),
});

export const updateGymSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
        coordinates: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional(),
      })
      .optional(),
    phone: z.string().optional(),
    email: z.email().optional(),
    amenities: z.array(z.string()).optional(),
    openingHours: z
      .object({
        monday: dayHoursSchema,
        tuesday: dayHoursSchema,
        wednesday: dayHoursSchema,
        thursday: dayHoursSchema,
        friday: dayHoursSchema,
        saturday: dayHoursSchema,
        sunday: dayHoursSchema,
      })
      .optional(),
    images: z.array(z.string()).optional(),
    logo: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const assignAdminSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
  }),
});
