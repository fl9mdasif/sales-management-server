import { z } from 'zod';

export const SellValidationSchema = z.object({
  body: z.object({
    sellId: z.string(),
    buyer: z.string(),
    quantity: z.number(),
    totalAmount: z.number().optional(),
    dateOfSales: z.string(),
  }),
});
