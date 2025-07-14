import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function CalendarLegend() {
  return (
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
          <div
            className="w-5 h-5 rounded-md shadow-sm"
            style={{ backgroundColor: '#a855f7' }}
          />
          <span className="text-sm font-medium">Period Days</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div
            className="w-5 h-5 rounded-md border-2 border-dashed shadow-sm"
            style={{
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              borderColor: '#a855f7',
            }}
          />
          <span className="text-sm font-medium">Predicted Period</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div
            className="w-5 h-5 rounded-md shadow-sm"
            style={{
              background:
                'linear-gradient(135deg, var(--cycle-fertile-start) 0%, var(--cycle-fertile-end) 100%)',
            }}
          />
          <span className="text-sm font-medium">Fertile Window</span>
        </div>
      </CardContent>
    </Card>
  );
}