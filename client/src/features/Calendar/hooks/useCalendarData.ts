import { useMemo } from "react";
import { addDays, isAfter } from "date-fns";
import type { Cycle, CyclePredictions } from "@/lib/api/cycle";

export function useCalendarData(
  cycles: Cycle[],
  predictions: CyclePredictions | undefined
) {
  // Find active cycle
  const activeCycle = useMemo(() => {
    const active = cycles.find((cycle) => cycle.isActive);
    return active || null;
  }, [cycles]);

  // Get all period days from cycles
  const periodDays = useMemo(() => {
    const days: Date[] = [];
    cycles.forEach((cycle) => {
      const startDate = new Date(cycle.startDate);
      const endDate = cycle.endDate ? new Date(cycle.endDate) : new Date();
      
      let currentDate = new Date(startDate);
      while (currentDate <= endDate && !isAfter(currentDate, endDate)) {
        days.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }
    });
    return days;
  }, [cycles]);

  // Use backend predictions if available
  const nextPeriodPrediction = useMemo(() => {
    if (predictions?.nextPeriodDate) {
      return new Date(predictions.nextPeriodDate);
    }
    return null;
  }, [predictions]);

  // Calculate predicted period days
  const nextPeriodDays = useMemo(() => {
    if (!nextPeriodPrediction || !predictions?.averagePeriodDuration) return [];
    
    return Array.from({ length: predictions.averagePeriodDuration }, (_, i) =>
      addDays(nextPeriodPrediction, i)
    );
  }, [nextPeriodPrediction, predictions]);

  // Use backend fertile window predictions
  const fertileDays = useMemo(() => {
    if (!predictions?.fertileWindowStart || !predictions?.fertileWindowEnd) return [];
    
    const fertileStart = new Date(predictions.fertileWindowStart);
    const fertileEnd = new Date(predictions.fertileWindowEnd);
    const days: Date[] = [];
    
    let currentDate = new Date(fertileStart);
    while (currentDate <= fertileEnd) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  }, [predictions]);

  // Get all days with entries
  const daysWithEntries = useMemo(() => {
    const days: Date[] = [];
    cycles.forEach((cycle) => {
      cycle.dayEntries.forEach((entry) => {
        if (entry.symptoms.length > 0 || entry.mood || entry.notes) {
          days.push(new Date(entry.date));
        }
      });
    });
    return days;
  }, [cycles]);

  return {
    activeCycle,
    periodDays,
    nextPeriodPrediction,
    nextPeriodDays,
    fertileDays,
    daysWithEntries
  };
}