import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, type ProfileFormValues } from './profile.schema';
import { useProfile, useUpdateProfile, useCreateProfile } from '@/hooks/useProfile';
import { useProfileStore } from '@/store/profileStore';

export const useProfileForm = () => {
  const { data: profile } = useProfile();
  const { profileExists } = useProfileStore();
  const updateProfileMutation = useUpdateProfile();
  const createProfileMutation = useCreateProfile();

  // Convert profile data to form values
  const defaultValues: ProfileFormValues = {
    lastPeriodDate: profile?.lastPeriodDate ? new Date(profile.lastPeriodDate) : null,
    cycleLength: profile?.cycleLength || 28,
    periodDuration: profile?.periodDuration || 5,
    contraception: profile?.contraception || '',
    notes: profile?.notes || '',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    // This ensures form updates when profile data changes
    values: defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const profileData = {
      ...data,
      lastPeriodDate: data.lastPeriodDate?.toISOString(),
      symptoms: [], // TODO: Add symptoms tracking
    };

    if (profileExists) {
      updateProfileMutation.mutate(profileData);
    } else {
      createProfileMutation.mutate(profileData);
    }
  };

  return {
    form,
    onSubmit,
    isLoading: updateProfileMutation.isPending || createProfileMutation.isPending,
    profileExists,
  };
};