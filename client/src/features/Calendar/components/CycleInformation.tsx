import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import type { Cycle, CyclePredictions } from "@/lib/api/cycle";
import type { Profile } from "@/lib/api/profile";

interface CycleInformationProps {
  predictions: CyclePredictions | undefined;
  profile: Profile | undefined;
  activeCycle: Cycle | null;
  getActiveCycleDay: (date: Date) => number | null;
  nextPeriodPrediction: Date | null;
}

export function CycleInformation({ 
  predictions, 
  profile, 
  activeCycle, 
  getActiveCycleDay,
  nextPeriodPrediction 
}: CycleInformationProps) {
  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Cycle Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Cycle Length
          </span>
          <span className="font-medium">
            {predictions?.averageCycleLength
              ? `${predictions.averageCycleLength} days`
              : profile?.cycleLength
              ? `${profile.cycleLength} days`
              : '-'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Period Duration
          </span>
          <span className="font-medium">
            {predictions?.averagePeriodDuration
              ? `${predictions.averagePeriodDuration} days`
              : profile?.periodDuration
              ? `${profile.periodDuration} days`
              : '-'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Next Period
          </span>
          <span className="font-medium">
            {nextPeriodPrediction
              ? format(nextPeriodPrediction, 'MMM d')
              : '-'}
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
  );
}