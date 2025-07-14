import { useState, useEffect } from 'react';
import type { DayEntry } from '@/lib/api/cycle';

export function useDayEntryForm(existingEntry?: DayEntry | null, open?: boolean) {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('');
  const [flow, setFlow] = useState<string>('none');
  const [temperature, setTemperature] = useState<string>('');
  const [notes, setNotes] = useState('');

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

  const getFormData = (date: Date) => {
    return {
      date: date.toISOString(),
      symptoms: symptoms.length > 0 ? symptoms : undefined,
      mood: mood as 'happy' | 'sad' | 'anxious' | 'irritable' | 'calm' | 'energetic' | undefined,
      flow: flow !== 'none' ? (flow as 'light' | 'medium' | 'heavy') : undefined,
      temperature: temperature ? parseFloat(temperature) : undefined,
      notes: notes || undefined,
    };
  };

  return {
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
  };
}