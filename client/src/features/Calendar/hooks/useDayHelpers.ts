import { isSameDay, format } from "date-fns";
import type { Cycle, DayEntry } from "@/lib/api/cycle";

export function useDayHelpers(
  periodDays: Date[],
  nextPeriodDays: Date[],
  fertileDays: Date[],
  cycles: Cycle[]
) {
  const isDayInPeriod = (day: Date) => {
    return periodDays.some(periodDay => isSameDay(periodDay, day));
  };

  const isDayPredicted = (day: Date) => {
    return nextPeriodDays.some(periodDay => isSameDay(periodDay, day));
  };

  const isDayFertile = (day: Date) => {
    return fertileDays.some(fertileDay => isSameDay(fertileDay, day));
  };

  const getDayEntry = (day: Date): DayEntry | null => {
    for (const cycle of cycles) {
      const entry = cycle.dayEntries.find(
        (e) => format(new Date(e.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      );
      if (entry) return entry;
    }
    return null;
  };

  const getCycleIdForDate = (date: Date, activeCycle: Cycle | null): string => {
    // Find the cycle that contains this date
    for (const cycle of cycles) {
      const startDate = new Date(cycle.startDate);
      const endDate = cycle.endDate ? new Date(cycle.endDate) : new Date();
      if (date >= startDate && date <= endDate) {
        return cycle.id;
      }
    }
    // If no cycle contains this date, use the active cycle if available
    return activeCycle?.id || cycles[0]?.id || '';
  };

  return {
    isDayInPeriod,
    isDayPredicted,
    isDayFertile,
    getDayEntry,
    getCycleIdForDate
  };
}