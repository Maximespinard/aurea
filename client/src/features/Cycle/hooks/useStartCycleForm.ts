import { useState } from 'react';
import { useCreateCycle } from '@/hooks/useCycle';

export function useStartCycleForm(onSuccess: () => void) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [flow, setFlow] = useState<string>('medium');
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const createCycleMutation = useCreateCycle();

  const resetForm = () => {
    setStartDate(new Date());
    setFlow('medium');
    setNotes('');
    setSymptoms([]);
  };

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
          onSuccess();
          resetForm();
        },
      }
    );
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  return {
    startDate,
    setStartDate,
    flow,
    setFlow,
    notes,
    setNotes,
    symptoms,
    toggleSymptom,
    handleSubmit,
    isLoading: createCycleMutation.isPending,
  };
}