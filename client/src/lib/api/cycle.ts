import { apiClient as api } from '@/lib/api';

// DTOs
export interface CreateCycleDto {
  startDate: string;
  endDate?: string;
  notes?: string;
  symptoms?: string[];
  flow?: 'light' | 'medium' | 'heavy';
}

export type UpdateCycleDto = Partial<CreateCycleDto> & {
  isActive?: boolean;
};

export interface CreateDayEntryDto {
  date: string;
  symptoms?: string[];
  mood?: 'happy' | 'sad' | 'anxious' | 'irritable' | 'calm' | 'energetic';
  notes?: string;
  flow?: 'none' | 'light' | 'medium' | 'heavy';
  temperature?: number;
}

// Types
export interface DayEntry {
  id: string;
  cycleId: string;
  date: string;
  symptoms: string[];
  mood: string | null;
  notes: string | null;
  flow: string | null;
  temperature: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: string;
  profileId: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  notes: string | null;
  symptoms: string[];
  flow: string | null;
  createdAt: string;
  updatedAt: string;
  dayEntries: DayEntry[];
}

export interface CyclePredictions {
  nextPeriodDate: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  averageCycleLength: number;
  averagePeriodDuration: number;
}

// API Methods
export const cycleApi = {
  // Cycle operations
  getCycles: async (): Promise<Cycle[]> => {
    const { data } = await api.get('/cycles');
    return data;
  },

  getCycle: async (id: string): Promise<Cycle> => {
    const { data } = await api.get(`/cycles/${id}`);
    return data;
  },

  createCycle: async (cycleData: CreateCycleDto): Promise<Cycle> => {
    const { data } = await api.post('/cycles', cycleData);
    return data;
  },

  updateCycle: async (id: string, cycleData: UpdateCycleDto): Promise<Cycle> => {
    const { data } = await api.put(`/cycles/${id}`, cycleData);
    return data;
  },

  deleteCycle: async (id: string): Promise<void> => {
    await api.delete(`/cycles/${id}`);
  },

  endActiveCycle: async (): Promise<Cycle> => {
    const { data } = await api.post('/cycles/end-active');
    return data;
  },

  // Day entry operations
  createOrUpdateDayEntry: async (
    cycleId: string,
    entryData: CreateDayEntryDto,
  ): Promise<DayEntry> => {
    const { data } = await api.post(`/cycles/${cycleId}/entries`, entryData);
    return data;
  },

  deleteDayEntry: async (cycleId: string, date: string): Promise<void> => {
    await api.delete(`/cycles/${cycleId}/entries`, { params: { date } });
  },

  // Predictions
  getPredictions: async (): Promise<CyclePredictions> => {
    const { data } = await api.get('/cycles/predictions');
    return data;
  },
};