import { create } from 'zustand';

interface Profile {
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

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  profileExists: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setProfileExists: (exists: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  profileExists: false,
  setProfile: (profile) => set({ profile, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setProfileExists: (exists) => set({ profileExists: exists }),
}));