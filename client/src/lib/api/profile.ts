import { apiClient as api } from '@/lib/api';

export interface CreateProfileDto {
  lastPeriodDate?: string;
  cycleLength?: number;
  periodDuration?: number;
  symptoms?: string[];
  contraception?: string;
  notes?: string;
}

export type UpdateProfileDto = Partial<CreateProfileDto>;

export interface Profile {
  id: string;
  userId: string;
  lastPeriodDate: Date | null;
  cycleLength: number | null;
  periodDuration: number | null;
  symptoms: string[];
  contraception: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get('/profile');
    return data;
  },

  createProfile: async (profileData: CreateProfileDto): Promise<Profile> => {
    const { data } = await api.post('/profile', profileData);
    return data;
  },

  updateProfile: async (profileData: UpdateProfileDto): Promise<Profile> => {
    const { data } = await api.put('/profile', profileData);
    return data;
  },

  checkProfileExists: async (): Promise<{ exists: boolean }> => {
    const { data } = await api.get('/profile/exists');
    return data;
  },
};