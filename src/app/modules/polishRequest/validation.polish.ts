import { z } from 'zod';

export const createPolishValidationSchema = z.object({
  body: z.object({
    userId: z.string(),
    polishType: z.enum(['cream', 'wax', 'liquid']),
    shineLevel: z.enum(['matte', 'glossy', 'high-glossy']),
    instructions: z.string().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']),
  }),
});
export const updatePolishValidationSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    polishType: z.string().optional(),
    shineLevel: z.string().optional(),
    instructions: z.string().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  }),
});

export const polishValidationSchema = {
  createPolishValidationSchema,
  updatePolishValidationSchema,
};
