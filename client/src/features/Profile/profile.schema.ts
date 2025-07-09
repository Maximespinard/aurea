import { z } from 'zod';

export const profileFormSchema = z.object({
  lastPeriodDate: z.date().optional().nullable(),
  cycleLength: z
    .number()
    .min(21, 'Cycle length must be at least 21 days')
    .max(45, 'Cycle length must be no more than 45 days')
    .optional(),
  periodDuration: z
    .number()
    .min(1, 'Period duration must be at least 1 day')
    .max(10, 'Period duration must be no more than 10 days')
    .optional(),
  contraception: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;