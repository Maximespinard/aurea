import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { useProfileStore } from '@/stores/profileStore';
import { toast } from 'react-hot-toast';
import type { ApiError } from '@/types/api';

export const useProfile = () => {
  const { setProfile, setLoading, setProfileExists } = useProfileStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await profileApi.getProfile();
        setProfile(data);
        setProfileExists(true);
        return data;
      } catch (error) {
        if ((error as ApiError).response?.status === 404) {
          setProfile(null);
          setProfileExists(false);
          return null;
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if ((error as ApiError).response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

export const useCheckProfileExists = () => {
  const { setProfileExists } = useProfileStore();

  return useQuery({
    queryKey: ['profile-exists'],
    queryFn: async () => {
      const { exists } = await profileApi.checkProfileExists();
      setProfileExists(exists);
      return exists;
    },
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { setProfile, setProfileExists } = useProfileStore();

  return useMutation({
    mutationFn: profileApi.createProfile,
    onSuccess: (data) => {
      setProfile(data);
      setProfileExists(true);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile-exists'] });
      toast.success('Profile created successfully!');
    },
    onError: (error) => {
      const message =
        (error as ApiError).response?.data?.message ||
        'Failed to create profile';
      toast.error(message);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setProfile } = useProfileStore();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      setProfile(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const message =
        (error as ApiError).response?.data?.message ||
        'Failed to update profile';
      toast.error(message);
    },
  });
};
