import { z } from 'zod';
import {
  EMAIL_MAX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
} from '@/lib/constants';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(USERNAME_MIN, {
        message: `Your username must contain at least ${USERNAME_MIN} characters`,
      })
      .max(USERNAME_MAX, {
        message: `Your username must be at most ${USERNAME_MAX} characters`,
      }),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .max(EMAIL_MAX, {
        message: `Email is too long (${EMAIL_MAX} characters max)`,
      }),
    password: z
      .string()
      .min(PASSWORD_MIN, {
        message: `Your password must contain at least ${PASSWORD_MIN} characters`,
      })
      .max(PASSWORD_MAX, {
        message: `Your password must be at most ${PASSWORD_MAX} characters`,
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
