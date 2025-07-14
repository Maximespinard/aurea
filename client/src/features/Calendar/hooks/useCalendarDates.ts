import { isSameDay, isAfter, startOfDay } from 'date-fns';

interface UseCalendarDatesProps {
  periodDays: Date[];
  predictedDays: Date[];
  fertileDays: Date[];
  daysWithEntries: Date[];
  selected?: Date | null;
}

export function useCalendarDates({
  periodDays,
  predictedDays,
  fertileDays,
  daysWithEntries,
  selected,
}: UseCalendarDatesProps) {
  const isPeriodDay = (date: Date) => 
    periodDays.some(d => isSameDay(d, date));

  const isPredictedDay = (date: Date) =>
    predictedDays.some(d => isSameDay(d, date));

  const isFertileDay = (date: Date) =>
    fertileDays.some(d => isSameDay(d, date));

  const isToday = (date: Date) =>
    isSameDay(date, new Date());

  const isSelected = (date: Date) =>
    selected ? isSameDay(date, selected) : false;

  const hasEntry = (date: Date) =>
    daysWithEntries.some(d => isSameDay(d, date));

  const isFutureDate = (date: Date) => {
    const today = startOfDay(new Date());
    return isAfter(startOfDay(date), today);
  };

  const getDayType = (date: Date) => {
    // Priority order: period > predicted > fertile
    if (isPeriodDay(date)) return 'period';
    if (isPredictedDay(date)) return 'predicted';
    if (isFertileDay(date)) return 'fertile';
    return null;
  };

  const getTileClassName = (date: Date) => {
    const classes = [];
    
    const dayType = getDayType(date);
    if (dayType) {
      classes.push(`${dayType}-day`);
    }
    
    if (isToday(date)) classes.push("today");
    if (isSelected(date)) classes.push("selected");
    if (hasEntry(date)) classes.push("has-entry");
    if (isFutureDate(date)) classes.push("future-date");
    
    return classes.join(" ");
  };

  return {
    isPeriodDay,
    isPredictedDay,
    isFertileDay,
    isToday,
    isSelected,
    hasEntry,
    isFutureDate,
    getDayType,
    getTileClassName,
  };
}