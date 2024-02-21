import { z } from 'zod';

const userRegistrationValidation = z.object({
  body: z.object({
    username: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(5),
    role: z.enum(['seller', 'buyer', 'superAdmin']),
  }),
});

export const userZodValidationSchema = {
  userRegistrationValidation,
};
