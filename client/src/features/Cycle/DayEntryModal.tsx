import { useState, useEffect } from 'react';
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
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('');
  const [flow, setFlow] = useState<string>('none');
  const [temperature, setTemperature] = useState<string>('');
  const [notes, setNotes] = useState('');

  const dayEntryMutation = useCreateOrUpdateDayEntry();

  // Initialize form with existing entry data
  useEffect(() => {
    if (existingEntry) {
      setSymptoms(existingEntry.symptoms || []);
      setMood(existingEntry.mood || '');
      setFlow(existingEntry.flow || 'none');
      setTemperature(existingEntry.temperature?.toString() || '');
      setNotes(existingEntry.notes || '');
    } else {
      // Reset form when no existing entry
      setSymptoms([]);
      setMood('');
      setFlow('none');
      setTemperature('');
      setNotes('');
    }
  }, [existingEntry, open]);

  const handleSubmit = () => {
    const data = {
      date: date.toISOString(),
      symptoms: symptoms.length > 0 ? symptoms : undefined,
      mood: mood as 'happy' | 'sad' | 'anxious' | 'irritable' | 'calm' | 'energetic' | undefined,
      flow: flow !== 'none' ? (flow as 'light' | 'medium' | 'heavy') : undefined,
      temperature: temperature ? parseFloat(temperature) : undefined,
      notes: notes || undefined,
    };

    dayEntryMutation.mutate(
      { cycleId, data },
      {
        onSuccess: () => {
          onOpenChange(false);
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
    'Acne',
    'Cravings',
  ];

  const moods = [
    { value: 'happy', label: '😊 Happy' },
    { value: 'sad', label: '😢 Sad' },
    { value: 'anxious', label: '😰 Anxious' },
    { value: 'irritable', label: '😤 Irritable' },
    { value: 'calm', label: '😌 Calm' },
    { value: 'energetic', label: '⚡ Energetic' },
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

          <div className="space-y-2">
            <Label>Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="How are you feeling?" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
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