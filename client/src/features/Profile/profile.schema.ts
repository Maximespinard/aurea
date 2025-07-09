import { z } from 'zod';
import {
  CYCLE_LENGTH_MIN,
  CYCLE_LENGTH_MAX,
  PERIOD_DURATION_MIN,
  PERIOD_DURATION_MAX,
  CONTRACEPTION_MAX,
  NOTES_MAX,
} from '@/lib/constants';

export const profileFormSchema = z.object({
  lastPeriodDate: z.date().optional().nullable(),
  cycleLength: z
    .number()
    .min(CYCLE_LENGTH_MIN, {
      message: `Cycle length must be at least ${CYCLE_LENGTH_MIN} days`,
    })
    .max(CYCLE_LENGTH_MAX, {
      message: `Cycle length must be no more than ${CYCLE_LENGTH_MAX} days`,
    })
    .optional(),
  periodDuration: z
    .number()
    .min(PERIOD_DURATION_MIN, {
      message: `Period duration must be at least ${PERIOD_DURATION_MIN} day`,
    })
    .max(PERIOD_DURATION_MAX, {
      message: `Period duration must be no more than ${PERIOD_DURATION_MAX} days`,
    })
    .optional(),
  contraception: z.string().max(CONTRACEPTION_MAX, {
    message: `Contraception must be at most ${CONTRACEPTION_MAX} characters`,
  }).optional(),
  notes: z.string().max(NOTES_MAX, {
    message: `Notes must be at most ${NOTES_MAX} characters`,
  }).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;