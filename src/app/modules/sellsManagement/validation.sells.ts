import { z } from 'zod';
import { Types } from 'mongoose';

export const SellValidationSchema = z.object({
  sellId: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid sellId',
  }),

  buyer: z.string(),
  quantity: z.number(),
  dateOfSales: z.date(),
});
