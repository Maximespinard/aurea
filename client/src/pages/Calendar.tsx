import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Droplets, Heart, Activity } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";

// Mock data - will be replaced with API data
const mockCycleData = {
  lastPeriodStart: new Date(2024, 11, 15), // December 15, 2024
  cycleLength: 28,
  periodDuration: 5,
  symptoms: {
    "2024-12-15": ["cramps", "headache"],
    "2024-12-16": ["cramps"],
    "2024-12-17": ["fatigue"],
  },
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Calculate period days
  const periodDays = Array.from({ length: mockCycleData.periodDuration }, (_, i) =>
    addDays(mockCycleData.lastPeriodStart, i)
  );

  // Calculate next period prediction
  const nextPeriodStart = addDays(mockCycleData.lastPeriodStart, mockCycleData.cycleLength);
  const nextPeriodDays = Array.from({ length: mockCycleData.periodDuration }, (_, i) =>
    addDays(nextPeriodStart, i)
  );

  // Calculate fertile window (approximately days 10-15 of cycle)
  const fertileStart = addDays(mockCycleData.lastPeriodStart, 10);
  const fertileDays = Array.from({ length: 6 }, (_, i) =>
    addDays(fertileStart, i)
  );

  const isDayInPeriod = (day: Date) => {
    return periodDays.some(periodDay => isSameDay(periodDay, day)) ||
           nextPeriodDays.some(periodDay => isSameDay(periodDay, day));
  };

  const isDayFertile = (day: Date) => {
    return fertileDays.some(fertileDay => isSameDay(fertileDay, day));
  };

  const getDaySymptoms = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return mockCycleData.symptoms[dateKey as keyof typeof mockCycleData.symptoms] || [];
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cycle Calendar</h1>
        <p className="text-muted-foreground mt-2">
          Track your menstrual cycle and symptoms
        </p>
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
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                period: (day) => isDayInPeriod(day),
                fertile: (day) => isDayFertile(day),
              }}
              modifiersStyles={{
                period: {
                  backgroundColor: "hsl(var(--destructive))",
                  color: "hsl(var(--destructive-foreground))",
                  borderRadius: "0.375rem",
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
                <span className="font-medium">{mockCycleData.cycleLength} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Period Duration</span>
                <span className="font-medium">{mockCycleData.periodDuration} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next Period</span>
                <span className="font-medium">{format(nextPeriodStart, "MMM d")}</span>
              </div>
            </CardContent>
          </Card>

          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isDayInPeriod(selectedDate) && (
                  <Badge className="mb-2" variant="destructive">
                    <Droplets className="w-3 h-3 mr-1" />
                    Period Day
                  </Badge>
                )}
                {isDayFertile(selectedDate) && (
                  <Badge className="mb-2 bg-green-600">
                    <Heart className="w-3 h-3 mr-1" />
                    Fertile Day
                  </Badge>
                )}
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Symptoms</p>
                  {getDaySymptoms(selectedDate).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getDaySymptoms(selectedDate).map((symptom, idx) => (
                        <Badge key={idx} variant="secondary">
                          <Activity className="w-3 h-3 mr-1" />
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No symptoms logged</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}