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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useCreateOrUpdateDayEntry } from '@/hooks/useCycle';
import { SymptomSelector } from './components/SymptomSelector';
import { MoodSelector } from './components/MoodSelector';
import { useDayEntryForm } from './hooks/useDayEntryForm';
import type { DayEntry } from '@/lib/api/cycle';

interface DayEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  cycleId: string;
  existingEntry?: DayEntry | null;
}

export function DayEntryModal({
  open,
  onOpenChange,
  date,
  cycleId,
  existingEntry,
}: DayEntryModalProps) {
  const dayEntryMutation = useCreateOrUpdateDayEntry();
  
  const {
    symptoms,
    setSymptoms,
    mood,
    setMood,
    flow,
    setFlow,
    temperature,
    setTemperature,
    notes,
    setNotes,
    getFormData,
  } = useDayEntryForm(existingEntry, open);

  const handleSubmit = () => {
    const data = getFormData(date);
    
    dayEntryMutation.mutate(
      { cycleId, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingEntry ? 'Edit' : 'Add'} Entry for {format(date, 'MMMM d, yyyy')}
          </DialogTitle>
          <DialogDescription>
            Track your symptoms, mood, and other details for this day.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Flow</Label>
            <Select value={flow} onValueChange={setFlow}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No bleeding</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <MoodSelector mood={mood} onChange={setMood} />

          <SymptomSelector symptoms={symptoms} onChange={setSymptoms} />

          <div className="space-y-2">
            <Label htmlFor="temperature">
              Temperature (°C) - Optional
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              min="35"
              max="38"
              placeholder="36.5"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes for this day..."
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
            disabled={dayEntryMutation.isPending}
          >
            {dayEntryMutation.isPending 
              ? 'Saving...' 
              : existingEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}