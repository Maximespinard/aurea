import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Droplets, Heart, Activity, Plus, Loader2, Edit } from "lucide-react";
import { format, addDays, isSameDay, isAfter } from "date-fns";
import { useCycles } from "@/hooks/useCycle";
import { useProfile } from "@/hooks/useProfile";
import { useCycleStore } from "@/stores/cycleStore";
import { StartCycleModal } from "@/features/Cycle/StartCycleModal";
import { EndCycleButton } from "@/features/Cycle/EndCycleButton";
import { DayEntryModal } from "@/features/Cycle/DayEntryModal";
import type { DayEntry } from "@/lib/api/cycle";

export default function Calendar() {
  const { selectedDate, setSelectedDate, setActiveCycle, getActiveCycleDay } = useCycleStore();
  const { data: cycles = [], isLoading: cyclesLoading } = useCycles();
  const { data: profile, isLoading: profileLoading } = useProfile();
  
  const [showStartModal, setShowStartModal] = useState(false);
  const [showDayEntryModal, setShowDayEntryModal] = useState(false);

  const isLoading = cyclesLoading || profileLoading;

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

  // Calculate next period prediction based on profile data
  const nextPeriodPrediction = useMemo(() => {
    if (!profile?.lastPeriodDate || !profile?.cycleLength) return null;
    
    // If there's an active cycle, use its start date
    const lastPeriodStart = activeCycle
      ? new Date(activeCycle.startDate)
      : new Date(profile.lastPeriodDate);
    
    return addDays(lastPeriodStart, profile.cycleLength);
  }, [profile, activeCycle]);

  // Calculate predicted period days
  const nextPeriodDays = useMemo(() => {
    if (!nextPeriodPrediction || !profile?.periodDuration) return [];
    
    return Array.from({ length: profile.periodDuration }, (_, i) =>
      addDays(nextPeriodPrediction, i)
    );
  }, [nextPeriodPrediction, profile?.periodDuration]);

  // Calculate fertile window (approximately days 10-15 of cycle)
  const fertileDays = useMemo(() => {
    if (!activeCycle && !profile?.lastPeriodDate) return [];
    
    const lastPeriodStart = activeCycle
      ? new Date(activeCycle.startDate)
      : new Date(profile!.lastPeriodDate!);
    
    const fertileStart = addDays(lastPeriodStart, 10);
    return Array.from({ length: 6 }, (_, i) =>
      addDays(fertileStart, i)
    );
  }, [activeCycle, profile]);

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
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date) => setSelectedDate(date || null)}
              className="rounded-md border"
              modifiers={{
                period: (day) => isDayInPeriod(day),
                predicted: (day) => isDayPredicted(day),
                fertile: (day) => isDayFertile(day),
              }}
              modifiersStyles={{
                period: {
                  backgroundColor: "hsl(var(--destructive))",
                  color: "hsl(var(--destructive-foreground))",
                  borderRadius: "0.375rem",
                },
                predicted: {
                  backgroundColor: "hsl(var(--destructive) / 0.3)",
                  color: "hsl(var(--destructive-foreground))",
                  borderRadius: "0.375rem",
                  border: "1px dashed hsl(var(--destructive))",
                },
                fertile: {
                  backgroundColor: "hsl(142, 76%, 36%)",
                  color: "white",
                  borderRadius: "0.375rem",
                },
              }}
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
                <div className="w-4 h-4 rounded bg-destructive" />
                <span className="text-sm">Period Days</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-destructive/30 border border-dashed border-destructive" />
                <span className="text-sm">Predicted Period</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-green-600" />
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
                  {profile?.cycleLength ? `${profile.cycleLength} days` : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Period Duration</span>
                <span className="font-medium">
                  {profile?.periodDuration ? `${profile.periodDuration} days` : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next Period</span>
                <span className="font-medium">
                  {nextPeriodPrediction ? format(nextPeriodPrediction, "MMM d") : '-'}
                </span>
              </div>
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
                    <Badge className="w-full justify-center" variant="destructive">
                      <Droplets className="w-3 h-3 mr-1" />
                      Period Day
                    </Badge>
                  )}
                  {isDayPredicted(selectedDate) && (
                    <Badge className="w-full justify-center" variant="outline">
                      <Droplets className="w-3 h-3 mr-1" />
                      Predicted Period
                    </Badge>
                  )}
                  {isDayFertile(selectedDate) && (
                    <Badge className="w-full justify-center bg-green-600">
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