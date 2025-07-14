import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const moodOptions = [
  { value: 'happy', label: 'Happy 😊' },
  { value: 'sad', label: 'Sad 😢' },
  { value: 'anxious', label: 'Anxious 😰' },
  { value: 'irritable', label: 'Irritable 😤' },
  { value: 'calm', label: 'Calm 😌' },
  { value: 'energetic', label: 'Energetic ⚡' },
];

interface MoodSelectorProps {
  mood: string;
  onChange: (mood: string) => void;
}

export function MoodSelector({ mood, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="mood">Mood</Label>
      <Select value={mood} onValueChange={onChange}>
        <SelectTrigger id="mood">
          <SelectValue placeholder="Select your mood" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {moodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}