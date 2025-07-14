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
import { useStartCycleForm } from './hooks/useStartCycleForm';
import { SymptomSelector } from './components/SymptomSelector';
import { DatePicker } from './components/DatePicker';

interface StartCycleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartCycleModal({ open, onOpenChange }: StartCycleModalProps) {
  const {
    startDate,
    setStartDate,
    flow,
    setFlow,
    notes,
    setNotes,
    symptoms,
    toggleSymptom,
    handleSubmit,
    isLoading,
  } = useStartCycleForm(() => onOpenChange(false));

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
            <DatePicker 
              date={startDate}
              onDateChange={setStartDate}
              placeholder="Pick a date"
            />
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

          <SymptomSelector 
            symptoms={symptoms} 
            onChange={(newSymptoms) => {
              // Replace all symptoms with the new selection
              newSymptoms.forEach(symptom => {
                if (!symptoms.includes(symptom)) {
                  toggleSymptom(symptom);
                }
              });
              symptoms.forEach(symptom => {
                if (!newSymptoms.includes(symptom)) {
                  toggleSymptom(symptom);
                }
              });
            }}
          />

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
            disabled={!startDate || isLoading}
          >
            {isLoading ? 'Starting...' : 'Start Period'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}