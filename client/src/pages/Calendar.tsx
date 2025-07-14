import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCycles, useCyclePredictions } from "@/hooks/useCycle";
import { useProfile } from "@/hooks/useProfile";
import { useCycleStore } from "@/stores/cycleStore";
import { StartCycleModal } from "@/features/Cycle/StartCycleModal";
import { DayEntryModal } from "@/features/Cycle/DayEntryModal";
import { CalendarWidget } from "@/features/Calendar/CalendarWidget";
import { CalendarHeader } from "@/features/Calendar/components/CalendarHeader";
import { CalendarLegend } from "@/features/Calendar/components/CalendarLegend";
import { CycleInformation } from "@/features/Calendar/components/CycleInformation";
import { DayDetails } from "@/features/Calendar/components/DayDetails";
import { useCalendarData } from "@/features/Calendar/hooks/useCalendarData";
import { useDayHelpers } from "@/features/Calendar/hooks/useDayHelpers";

export default function Calendar() {
  const { selectedDate, setSelectedDate, setActiveCycle, getActiveCycleDay } = useCycleStore();
  const { data: cycles = [], isLoading: cyclesLoading } = useCycles();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: predictions, isLoading: predictionsLoading } = useCyclePredictions();
  
  const [showStartModal, setShowStartModal] = useState(false);
  const [showDayEntryModal, setShowDayEntryModal] = useState(false);

  const isLoading = cyclesLoading || profileLoading || predictionsLoading;

  // Use custom hooks for data management
  const {
    activeCycle,
    periodDays,
    nextPeriodPrediction,
    nextPeriodDays,
    fertileDays,
    daysWithEntries
  } = useCalendarData(cycles, predictions);

  const {
    isDayInPeriod,
    isDayPredicted,
    isDayFertile,
    getDayEntry,
    getCycleIdForDate
  } = useDayHelpers(periodDays, nextPeriodDays, fertileDays, cycles);

  // Set active cycle in store
  useEffect(() => {
    setActiveCycle(activeCycle);
  }, [activeCycle, setActiveCycle]);

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <CalendarHeader
        activeCycle={activeCycle}
        getActiveCycleDay={getActiveCycleDay}
        onStartPeriod={() => setShowStartModal(true)}
      />

      <div
        className="grid gap-6 lg:grid-cols-[minmax(600px,_700px)_320px] 
  xl:grid-cols-[minmax(700px,_800px)_360px] px-6"
      >
        {' '}
        <Card className="shadow-xl border-primary/10 overflow-hidden">
          <CardContent className="px-6">
            <CalendarWidget
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date)}
              periodDays={periodDays}
              predictedDays={nextPeriodDays}
              fertileDays={fertileDays}
              activeCycleDay={(date) => getActiveCycleDay(date)}
              daysWithEntries={daysWithEntries}
            />
          </CardContent>
        </Card>
        <div className="space-y-3">
          <CalendarLegend />
          
          <CycleInformation
            predictions={predictions}
            profile={profile}
            activeCycle={activeCycle}
            getActiveCycleDay={getActiveCycleDay}
            nextPeriodPrediction={nextPeriodPrediction}
          />

          {selectedDate && (
            <DayDetails
              selectedDate={selectedDate}
              cycles={cycles}
              isDayInPeriod={isDayInPeriod}
              isDayPredicted={isDayPredicted}
              isDayFertile={isDayFertile}
              getDayEntry={getDayEntry}
              onEditEntry={() => setShowDayEntryModal(true)}
            />
          )}
        </div>
      </div>

      <StartCycleModal open={showStartModal} onOpenChange={setShowStartModal} />

      {selectedDate && cycles.length > 0 && (
        <DayEntryModal
          open={showDayEntryModal}
          onOpenChange={setShowDayEntryModal}
          date={selectedDate}
          cycleId={getCycleIdForDate(selectedDate, activeCycle)}
          existingEntry={getDayEntry(selectedDate)}
        />
      )}
    </div>
  );
}