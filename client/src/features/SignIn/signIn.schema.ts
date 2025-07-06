import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: 'Password Required' }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
