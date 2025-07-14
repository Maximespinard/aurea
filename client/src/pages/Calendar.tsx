import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Droplets, Heart, Activity, Plus, Loader2, Edit } from "lucide-react";
import { format, addDays, isSameDay, isAfter } from "date-fns";
import { useCycles, useCyclePredictions } from "@/hooks/useCycle";
import { useProfile } from "@/hooks/useProfile";
import { useCycleStore } from "@/stores/cycleStore";
import { StartCycleModal } from "@/features/Cycle/StartCycleModal";
import { EndCycleButton } from "@/features/Cycle/EndCycleButton";
import { DayEntryModal } from "@/features/Cycle/DayEntryModal";
import { PremiumCalendar } from "@/components/Calendar/PremiumCalendar";
import type { DayEntry } from "@/lib/api/cycle";

export default function Calendar() {
  const { selectedDate, setSelectedDate, setActiveCycle, getActiveCycleDay } = useCycleStore();
  const { data: cycles = [], isLoading: cyclesLoading } = useCycles();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: predictions, isLoading: predictionsLoading } = useCyclePredictions();
  
  const [showStartModal, setShowStartModal] = useState(false);
  const [showDayEntryModal, setShowDayEntryModal] = useState(false);

  const isLoading = cyclesLoading || profileLoading || predictionsLoading;

  // Find active cycle and set it in store
  const activeCycle = useMemo(() => {
    const active = cycles.find((cycle) => cycle.isActive);
    return active || null;
  }, [cycles]);

  useEffect(() => {
    setActiveCycle(activeCycle);
  }, [activeCycle, setActiveCycle]);

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

  // Use backend predictions if available, fallback to simple calculation
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

  const isDayInPeriod = (day: Date) => {
    return periodDays.some(periodDay => isSameDay(periodDay, day));
  };

  const isDayPredicted = (day: Date) => {
    return nextPeriodDays.some(periodDay => isSameDay(periodDay, day));
  };

  const isDayFertile = (day: Date) => {
    return fertileDays.some(fertileDay => isSameDay(fertileDay, day));
  };

  // Get symptoms for a specific day
  const getDayEntry = (day: Date): DayEntry | null => {
    for (const cycle of cycles) {
      const entry = cycle.dayEntries.find(
        (e) => format(new Date(e.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      );
      if (entry) return entry;
    }
    return null;
  };

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
    <div className="container max-w-6xl py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Cycle Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Track your menstrual cycle and symptoms
          </p>
        </div>
        <div className="flex gap-2">
          {!activeCycle && (
            <Button onClick={() => setShowStartModal(true)}>
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

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <PremiumCalendar
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date)}
              periodDays={periodDays}
              predictedDays={nextPeriodDays}
              fertileDays={fertileDays}
              activeCycleDay={(date) => getActiveCycleDay(date)}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
              <CardDescription>Cycle phase indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--cycle-period-color)' }} />
                <span className="text-sm">Period Days</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded border-2 border-dashed" 
                  style={{ 
                    backgroundColor: 'var(--cycle-period-light)', 
                    borderColor: 'var(--cycle-period-color)' 
                  }} 
                />
                <span className="text-sm">Predicted Period</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ 
                    background: 'linear-gradient(135deg, var(--cycle-fertile-start) 0%, var(--cycle-fertile-end) 100%)' 
                  }} 
                />
                <span className="text-sm">Fertile Window</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cycle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cycle Length</span>
                <span className="font-medium">
                  {predictions?.averageCycleLength ? `${predictions.averageCycleLength} days` : profile?.cycleLength ? `${profile.cycleLength} days` : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Period Duration</span>
                <span className="font-medium">
                  {predictions?.averagePeriodDuration ? `${predictions.averagePeriodDuration} days` : profile?.periodDuration ? `${profile.periodDuration} days` : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next Period</span>
                <span className="font-medium">
                  {nextPeriodPrediction ? format(nextPeriodPrediction, "MMM d") : '-'}
                </span>
              </div>
              {predictions && cycles.filter(c => c.endDate).length >= 2 && (
                <div className="text-xs text-muted-foreground text-center pt-2">
                  Based on {cycles.filter(c => c.endDate).length} previous cycles
                </div>
              )}
              {activeCycle && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-destructive">
                    Active period (Day {getActiveCycleDay(new Date())})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedDate && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                {cycles.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDayEntryModal(true)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    {getDayEntry(selectedDate) ? 'Edit' : 'Add'} Entry
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isDayInPeriod(selectedDate) && (
                    <Badge className="w-full justify-center badge-period">
                      <Droplets className="w-3 h-3 mr-1" />
                      Period Day
                    </Badge>
                  )}
                  {isDayPredicted(selectedDate) && (
                    <Badge className="w-full justify-center badge-predicted">
                      <Droplets className="w-3 h-3 mr-1" />
                      Predicted Period
                    </Badge>
                  )}
                  {isDayFertile(selectedDate) && (
                    <Badge className="w-full justify-center badge-fertile">
                      <Heart className="w-3 h-3 mr-1" />
                      Fertile Day
                    </Badge>
                  )}
                </div>
                
                {(() => {
                  const dayEntry = getDayEntry(selectedDate);
                  return (
                    <>
                      {dayEntry && (
                        <div className="mt-4 space-y-3">
                          {dayEntry.symptoms.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Symptoms</p>
                              <div className="flex flex-wrap gap-2">
                                {dayEntry.symptoms.map((symptom, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    <Activity className="w-3 h-3 mr-1" />
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {dayEntry.mood && (
                            <div>
                              <p className="text-sm font-medium mb-1">Mood</p>
                              <p className="text-sm capitalize">{dayEntry.mood}</p>
                            </div>
                          )}
                          {dayEntry.notes && (
                            <div>
                              <p className="text-sm font-medium mb-1">Notes</p>
                              <p className="text-sm">{dayEntry.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {!dayEntry && (
                        <p className="text-sm text-muted-foreground mt-4">
                          No data logged for this day
                        </p>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <StartCycleModal 
        open={showStartModal} 
        onOpenChange={setShowStartModal} 
      />

      {selectedDate && cycles.length > 0 && (
        <DayEntryModal
          open={showDayEntryModal}
          onOpenChange={setShowDayEntryModal}
          date={selectedDate}
          cycleId={(() => {
            // Find the cycle that contains this date
            for (const cycle of cycles) {
              const startDate = new Date(cycle.startDate);
              const endDate = cycle.endDate ? new Date(cycle.endDate) : new Date();
              if (selectedDate >= startDate && selectedDate <= endDate) {
                return cycle.id;
              }
            }
            // If no cycle contains this date, use the active cycle if available
            return activeCycle?.id || cycles[0]?.id || '';
          })()}
          existingEntry={getDayEntry(selectedDate)}
        />
      )}
    </div>
  );
}