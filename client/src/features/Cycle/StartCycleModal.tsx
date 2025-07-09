import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateCycle } from '@/hooks/useCycle';

interface StartCycleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartCycleModal({ open, onOpenChange }: StartCycleModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [flow, setFlow] = useState<string>('medium');
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const createCycleMutation = useCreateCycle();

  const handleSubmit = () => {
    if (!startDate) return;

    createCycleMutation.mutate(
      {
        startDate: startDate.toISOString(),
        flow: flow as 'light' | 'medium' | 'heavy',
        notes: notes || undefined,
        symptoms: symptoms.length > 0 ? symptoms : undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          // Reset form
          setStartDate(new Date());
          setFlow('medium');
          setNotes('');
          setSymptoms([]);
        },
      }
    );
  };

  const commonSymptoms = [
    'Cramps',
    'Headache',
    'Backache',
    'Bloating',
    'Mood swings',
    'Fatigue',
    'Nausea',
    'Breast tenderness',
  ];

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Period</DialogTitle>
          <DialogDescription>
            Record the start of your menstrual period. You can add more details later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Flow Intensity</Label>
            <Select value={flow} onValueChange={setFlow}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Symptoms</Label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <Button
                  key={symptom}
                  type="button"
                  variant={symptoms.includes(symptom) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!startDate || createCycleMutation.isPending}
          >
            {createCycleMutation.isPending ? 'Starting...' : 'Start Period'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}