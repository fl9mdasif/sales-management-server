import z from 'zod';

// Zod schema for the Course object
const CreateShoesValidationSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    productName: z.string(),
    quantity: z.number(), // Assuming you're using strings as ObjectIds, adjust if needed
    price: z.number(),
    productDescription: z.string(),

    brand: z.string(),
    model: z.string(),
    size: z.string(),
    category: z.string(),
    gender: z.string(),
    color: z.string(),
    rawMaterial: z.string(),
  }),
});

// update
// Zod schema for the Course object
const UpdateShoesValidationSchema = z.object({
  id: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.number().optional(), // Assuming you're using strings as ObjectIds, adjust if needed
  price: z.number().optional(),
  productDescription: z.string().optional(),
  coverPhoto: z.string().optional(),
  uploadDate: z.string().optional(),
});

export const ShoesValidation = {
  CreateShoesValidationSchema,
  UpdateShoesValidationSchema,
};
