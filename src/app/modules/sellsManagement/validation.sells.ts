import { z } from 'zod';

export const salesValidationSchema = z.object({
  body: z.object({
    productId: z.string(),
    buyer: z.string(),
    quantity: z.number(),
    totalAmount: z.number().optional(),
    dateOfSales: z.string(),
  }),
});
