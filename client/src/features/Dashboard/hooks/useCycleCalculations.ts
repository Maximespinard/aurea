import { addDays, differenceInDays } from 'date-fns';
import type { Profile } from '@/lib/api/profile';

export function useCycleCalculations(profile: Profile | undefined) {
  const calculateCycleData = () => {
    if (!profile?.lastPeriodDate) {
      return {
        currentDay: '--',
        nextPeriod: '--',
        cycleLength: '--',
      };
    }

    const lastPeriod = new Date(profile.lastPeriodDate);
    const today = new Date();
    const daysSinceLastPeriod = differenceInDays(today, lastPeriod);
    const cycleLength = profile.cycleLength || 28;
    const nextPeriodDate = addDays(lastPeriod, cycleLength);
    const daysUntilNextPeriod = differenceInDays(nextPeriodDate, today);

    return {
      currentDay: daysSinceLastPeriod + 1,
      nextPeriod: daysUntilNextPeriod > 0 
        ? `${daysUntilNextPeriod} days` 
        : daysUntilNextPeriod === 0 
        ? 'Today' 
        : 'Late',
      cycleLength: `${cycleLength} days`,
    };
  };

  return calculateCycleData();
}