import { useState } from "react";
import Calendar from "react-calendar";
import { format, isSameDay } from "date-fns";
import "./PremiumCalendar.css";

interface PremiumCalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  periodDays: Date[];
  predictedDays: Date[];
  fertileDays: Date[];
  activeCycleDay?: (date: Date) => number | null;
}

export function PremiumCalendar({
  selected,
  onSelect,
  periodDays,
  predictedDays,
  fertileDays,
  activeCycleDay,
}: PremiumCalendarProps) {
  const [value, setValue] = useState<Date>(selected || new Date());

  const handleDateChange = (newValue: any, _event: any) => {
    if (!newValue) return;
    const date = Array.isArray(newValue) ? newValue[0] : newValue;
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

  const getTileContent = ({ date }: { date: Date }) => {
    const cycleDay = activeCycleDay?.(date);
    const isPeriod = isPeriodDay(date);
    
    return (
      <div className="tile-content">
        <span className="date-number">{format(date, "d")}</span>
        {isPeriod && cycleDay && (
          <span className="cycle-badge">D{cycleDay}</span>
        )}
        {isFertileDay(date) && (
          <span className="fertile-icon">✦</span>
        )}
      </div>
    );
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    const classes = ["calendar-tile"];
    
    if (isPeriodDay(date)) classes.push("period-day");
    if (isPredictedDay(date)) classes.push("predicted-day");
    if (isFertileDay(date)) classes.push("fertile-day");
    if (isToday(date)) classes.push("today");
    if (isSelected(date)) classes.push("selected");
    
    return classes.join(" ");
  };

  return (
    <div className="premium-calendar-wrapper">
      <Calendar
        value={value}
        onChange={handleDateChange}
        className="premium-calendar"
        tileContent={getTileContent}
        tileClassName={getTileClassName}
        showNeighboringMonth={false}
        prevLabel="‹"
        nextLabel="›"
        prev2Label="«"
        next2Label="»"
        formatShortWeekday={(_locale, date) => 
          format(date, "EEE").slice(0, 2).toUpperCase()
        }
      />
    </div>
  );
}