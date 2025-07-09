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
      })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username can only contain letters, numbers, underscores, and hyphens',
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
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
