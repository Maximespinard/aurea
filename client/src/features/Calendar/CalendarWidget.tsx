import { useState, useRef, useCallback } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { CalendarTileContent } from "./components/CalendarTileContent";
import { useCalendarDates } from "./hooks/useCalendarDates";
import { useClickOutside } from "./hooks/useClickOutside";
import { CALENDAR_CONFIG, WEEKDAY_FORMAT } from "./constants";
import "./CalendarWidget.css";

interface CalendarWidgetProps {
  selected?: Date | null;
  onSelect?: (date: Date | null) => void;
  periodDays: Date[];
  predictedDays: Date[];
  fertileDays: Date[];
  activeCycleDay?: (date: Date) => number | null;
  daysWithEntries?: Date[];
}

export function CalendarWidget({
  selected,
  onSelect,
  periodDays,
  predictedDays,
  fertileDays,
  activeCycleDay,
  daysWithEntries = [],
}: CalendarWidgetProps) {
  const [value, setValue] = useState<Date>(selected || new Date());
  const calendarRef = useRef<HTMLDivElement | null>(null);
  
  const {
    isPeriodDay,
    isFertileDay,
    hasEntry,
    getTileClassName,
  } = useCalendarDates({
    periodDays,
    predictedDays,
    fertileDays,
    daysWithEntries,
    selected,
  });

  // Handle deselection when clicking outside
  const handleClickOutside = useCallback(() => {
    onSelect?.(null);
  }, [onSelect]);
  
  useClickOutside(calendarRef, handleClickOutside, '.space-y-3');

  const handleDateChange = useCallback((newValue: Date | Date[] | [Date | null, Date | null] | null) => {
    if (!newValue) return;
    
    let date: Date | null = null;
    if (Array.isArray(newValue)) {
      date = newValue[0];
    } else {
      date = newValue;
    }
    
    if (date instanceof Date) {
      setValue(date);
      onSelect?.(date);
    }
  }, [onSelect]);

  const getTileContent = useCallback(({ date }: { date: Date }) => {
    const cycleDay = activeCycleDay?.(date);
    
    return (
      <CalendarTileContent
        cycleDay={cycleDay}
        isPeriodDay={isPeriodDay(date)}
        isFertileDay={isFertileDay(date)}
        hasEntry={hasEntry(date)}
      />
    );
  }, [activeCycleDay, isPeriodDay, isFertileDay, hasEntry]);

  const getTileClassNameWrapper = useCallback(({ date }: { date: Date }) => {
    return getTileClassName(date);
  }, [getTileClassName]);

  const formatWeekday = useCallback((_locale: string | undefined, date: Date) => {
    const formatted = format(date, "EEE").slice(0, WEEKDAY_FORMAT.length);
    return WEEKDAY_FORMAT.uppercase ? formatted.toUpperCase() : formatted;
  }, []);

  // Prevent navigation callbacks
  const preventNavigation = useCallback(() => {}, []);

  return (
    <div className="premium-calendar-wrapper" ref={calendarRef}>
      <Calendar
        value={value}
        onChange={handleDateChange}
        className="premium-calendar"
        tileContent={getTileContent}
        tileClassName={getTileClassNameWrapper}
        formatShortWeekday={formatWeekday}
        onClickMonth={preventNavigation}
        onClickYear={preventNavigation}
        onClickDecade={preventNavigation}
        {...CALENDAR_CONFIG}
      />
    </div>
  );
}