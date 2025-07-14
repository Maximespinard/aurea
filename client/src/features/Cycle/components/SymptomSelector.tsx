import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const commonSymptoms = [
  'Cramping',
  'Bloating',
  'Headache',
  'Backache',
  'Breast tenderness',
  'Fatigue',
  'Nausea',
  'Mood swings',
];

interface SymptomSelectorProps {
  symptoms: string[];
  onChange: (symptoms: string[]) => void;
}

export function SymptomSelector({ symptoms, onChange }: SymptomSelectorProps) {
  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      onChange(symptoms.filter((s) => s !== symptom));
    } else {
      onChange([...symptoms, symptom]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Symptoms</Label>
      <div className="flex flex-wrap gap-2">
        {commonSymptoms.map((symptom) => (
          <Badge
            key={symptom}
            variant={symptoms.includes(symptom) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleSymptom(symptom)}
          >
            {symptom}
            {symptoms.includes(symptom) && (
              <X className="w-3 h-3 ml-1" />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}