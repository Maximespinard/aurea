import { FileText } from 'lucide-react';

interface CycleBadgeProps {
  day: number;
}

export function CycleBadge({ day }: CycleBadgeProps) {
  return <span className="cycle-badge">D{day}</span>;
}

export function FertileIcon() {
  return <span className="fertile-icon">✦</span>;
}

interface EntryIndicatorProps {
  hasEntry: boolean;
}

export function EntryIndicator({ hasEntry }: EntryIndicatorProps) {
  if (!hasEntry) return null;
  
  return (
    <span className="entry-indicator" title="Has notes">
      <FileText size={12} />
    </span>
  );
}

interface CalendarTileContentProps {
  cycleDay?: number | null;
  isPeriodDay: boolean;
  isFertileDay: boolean;
  hasEntry: boolean;
}

export function CalendarTileContent({
  cycleDay,
  isPeriodDay,
  isFertileDay,
  hasEntry,
}: CalendarTileContentProps) {
  return (
    <>
      {isPeriodDay && cycleDay && <CycleBadge day={cycleDay} />}
      {isFertileDay && !isPeriodDay && <FertileIcon />}
      {hasEntry && !isPeriodDay && <EntryIndicator hasEntry={hasEntry} />}
    </>
  );
}