import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Heart, Activity, Plus, Loader2, Edit, Sparkles, TrendingUp } from "lucide-react";
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

  // Get all days with entries (symptoms, mood, or notes)
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
                onClick={() => setShowStartModal(true)}
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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] px-6">
        <Card className="shadow-xl border-primary/10 overflow-hidden">
          <CardContent className="p-6">
            <PremiumCalendar
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
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Legend
              </CardTitle>
              <CardDescription>Cycle phase indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-5 h-5 rounded-md shadow-sm" style={{ backgroundColor: 'var(--cycle-period-color)' }} />
                <span className="text-sm font-medium">Period Days</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div 
                  className="w-5 h-5 rounded-md border-2 border-dashed shadow-sm" 
                  style={{ 
                    backgroundColor: 'var(--cycle-period-light)', 
                    borderColor: 'var(--cycle-period-color)' 
                  }} 
                />
                <span className="text-sm font-medium">Predicted Period</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div 
                  className="w-5 h-5 rounded-md shadow-sm" 
                  style={{ 
                    background: 'linear-gradient(135deg, var(--cycle-fertile-start) 0%, var(--cycle-fertile-end) 100%)' 
                  }} 
                />
                <span className="text-sm font-medium">Fertile Window</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Cycle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
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
              {activeCycle && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Active period (Day {getActiveCycleDay(new Date())})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedDate && (
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                {cycles.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDayEntryModal(true)}
                    className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    {getDayEntry(selectedDate) ? 'Edit' : 'Add'} Entry
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  {isDayInPeriod(selectedDate) && (
                    <Badge className="w-full justify-center badge-period py-2 text-sm">
                      <Droplets className="w-4 h-4 mr-2" />
                      Period Day
                    </Badge>
                  )}
                  {isDayPredicted(selectedDate) && (
                    <Badge className="w-full justify-center badge-predicted py-2 text-sm">
                      <Droplets className="w-4 h-4 mr-2" />
                      Predicted Period
                    </Badge>
                  )}
                  {isDayFertile(selectedDate) && (
                    <Badge className="w-full justify-center badge-fertile py-2 text-sm">
                      <Heart className="w-4 h-4 mr-2" />
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