import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Heart, Activity, Edit } from "lucide-react";
import { format } from "date-fns";
import type { DayEntry, Cycle } from "@/lib/api/cycle";

interface DayDetailsProps {
  selectedDate: Date;
  cycles: Cycle[];
  isDayInPeriod: (day: Date) => boolean;
  isDayPredicted: (day: Date) => boolean;
  isDayFertile: (day: Date) => boolean;
  getDayEntry: (day: Date) => DayEntry | null;
  onEditEntry: () => void;
}

export function DayDetails({
  selectedDate,
  cycles,
  isDayInPeriod,
  isDayPredicted,
  isDayFertile,
  getDayEntry,
  onEditEntry
}: DayDetailsProps) {
  const dayEntry = getDayEntry(selectedDate);

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {format(selectedDate, 'MMMM d, yyyy')}
        </CardTitle>
        {cycles.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onEditEntry}
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
          >
            <Edit className="mr-1 h-3 w-3" />
            {dayEntry ? 'Edit' : 'Add'} Entry
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

        {dayEntry && (
          <div className="mt-4 space-y-3">
            {dayEntry.symptoms.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Symptoms
                </p>
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
                <p className="text-sm capitalize">
                  {dayEntry.mood}
                </p>
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
      </CardContent>
    </Card>
  );
}