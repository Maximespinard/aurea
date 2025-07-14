import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { format, isSameDay } from "date-fns";
import "./PremiumCalendar.css";

interface PremiumCalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date | null) => void;
  periodDays: Date[];
  predictedDays: Date[];
  fertileDays: Date[];
  activeCycleDay?: (date: Date) => number | null;
  daysWithEntries?: Date[];
}

export function PremiumCalendar({
  selected,
  onSelect,
  periodDays,
  predictedDays,
  fertileDays,
  activeCycleDay,
  daysWithEntries = [],
}: PremiumCalendarProps) {
  const [value, setValue] = useState<Date>(selected || new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside calendar to deselect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        // Check if click is not on the right sidebar (day details)
        const target = event.target as HTMLElement;
        const isInSidebar = target.closest('.space-y-3'); // The right sidebar container
        
        if (!isInSidebar) {
          onSelect?.(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSelect]);

  const handleDateChange = (newValue: Date | Date[] | [Date | null, Date | null] | null) => {
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
  };

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

  const getTileContent = ({ date }: { date: Date }) => {
    const cycleDay = activeCycleDay?.(date);
    const isPeriod = isPeriodDay(date);
    const hasData = hasEntry(date);
    
    return (
      <>
        {isPeriod && cycleDay && (
          <span className="cycle-badge">D{cycleDay}</span>
        )}
        {isFertileDay(date) && (
          <span className="fertile-icon">✦</span>
        )}
        {hasData && !isPeriod && (
          <span className="entry-indicator" title="Has notes">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3z"/>
              <path d="M4 4h8v1H4V4zm0 3h8v1H4V7zm0 3h5v1H4v-1z"/>
            </svg>
          </span>
        )}
      </>
    );
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    const classes = [];
    
    // Priority order: period > predicted > fertile
    const isPeriod = isPeriodDay(date);
    const isPredicted = isPredictedDay(date);
    const isFertile = isFertileDay(date);
    
    if (isPeriod) {
      classes.push("period-day");
    } else if (isPredicted) {
      classes.push("predicted-day");
    } else if (isFertile) {
      classes.push("fertile-day");
    }
    
    if (isToday(date)) classes.push("today");
    if (isSelected(date)) classes.push("selected");
    if (hasEntry(date)) classes.push("has-entry");
    
    return classes.join(" ");
  };

  return (
    <div className="premium-calendar-wrapper" ref={calendarRef}>
      <Calendar
        value={value}
        onChange={handleDateChange}
        className="premium-calendar"
        tileContent={getTileContent}
        tileClassName={getTileClassName}
        showNeighboringMonth={true}
        showFixedNumberOfWeeks={false}
        prevLabel="‹"
        nextLabel="›"
        prev2Label="«"
        next2Label="»"
        formatShortWeekday={(_locale, date) => 
          format(date, "EEE").slice(0, 2).toUpperCase()
        }
        onClickMonth={() => {}} // Disable month selection
        onClickYear={() => {}} // Disable year selection
        onClickDecade={() => {}} // Disable decade selection
        view="month" // Force month view
        maxDetail="month" // Prevent drilling down to year/decade view
      />
    </div>
  );
}