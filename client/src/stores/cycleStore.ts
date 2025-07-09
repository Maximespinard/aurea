import { create } from 'zustand';
import type { Cycle } from '@/lib/api/cycle';

interface CycleState {
  // State
  activeCycle: Cycle | null;
  selectedCycleId: string | null;
  selectedDate: Date | null;
  
  // Actions
  setActiveCycle: (cycle: Cycle | null) => void;
  setSelectedCycleId: (id: string | null) => void;
  setSelectedDate: (date: Date | null) => void;
  
  // Computed
  getActiveCycleDay: (date: Date) => number | null;
}

export const useCycleStore = create<CycleState>((set, get) => ({
  // Initial state
  activeCycle: null,
  selectedCycleId: null,
  selectedDate: null,

  // Actions
  setActiveCycle: (cycle) => set({ activeCycle: cycle }),
  setSelectedCycleId: (id) => set({ selectedCycleId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  // Computed values
  getActiveCycleDay: (date) => {
    const { activeCycle } = get();
    if (!activeCycle) return null;

    const startDate = new Date(activeCycle.startDate);
    const checkDate = new Date(date);
    
    // Reset time parts for accurate day calculation
    startDate.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    const diffTime = checkDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Return null if date is before cycle start
    if (diffDays < 0) return null;

    // Return day number (1-based)
    return diffDays + 1;
  },
}));