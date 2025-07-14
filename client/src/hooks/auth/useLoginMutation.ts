import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api/auth';
import { handleAuthError } from '@/lib/error-utils';
import { useAuthStore } from '@/stores/authStore';
import { profileApi } from '@/lib/api/profile';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Update Zustand store with user data and token
      setAuth(data.user, data.access_token);
      
      try {
        // Check if user has a profile
        const { exists } = await profileApi.checkProfileExists();
        
        if (exists) {
          // User has a profile, go to dashboard
          toast.success('Welcome back to Auréa!');
          navigate('/dashboard');
        } else {
          // User needs to set up profile
          toast.success('Welcome! Please set up your profile.');
          navigate('/dashboard/profile');
        }
      } catch (error) {
        // If profile check fails, go to dashboard anyway
        console.error('Failed to check profile:', error);
        toast.success('Welcome back to Auréa!');
        navigate('/dashboard');
      }
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error);
      handleAuthError(error);
    },
  });
};