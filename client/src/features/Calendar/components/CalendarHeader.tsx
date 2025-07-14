import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EndCycleButton } from "@/features/Cycle/EndCycleButton";
import type { Cycle } from "@/lib/api/cycle";

interface CalendarHeaderProps {
  activeCycle: Cycle | null;
  getActiveCycleDay: (date: Date) => number | null;
  onStartPeriod: () => void;
}

export function CalendarHeader({ 
  activeCycle, 
  getActiveCycleDay, 
  onStartPeriod 
}: CalendarHeaderProps) {
  return (
    <div className="mb-8 p-8 -m-6 rounded-b-2xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Cycle Calendar
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Track your menstrual cycle and symptoms
          </p>
        </div>
        <div className="flex gap-2">
          {!activeCycle && (
            <Button
              onClick={onStartPeriod}
              className="bg-primary hover:bg-primary/90 shadow-lg"
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Start Period
            </Button>
          )}
          {activeCycle && (
            <EndCycleButton
              cycleStartDate={activeCycle.startDate}
              currentDay={getActiveCycleDay(new Date()) || 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}