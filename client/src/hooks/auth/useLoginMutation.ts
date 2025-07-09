import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { handleAuthError } from '@/lib/error-utils';
import { useAuthStore } from '@/stores/authStore';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Update Zustand store with user data and token
      setAuth(data.user, data.access_token);
      // Show success toast
      toast.success('Welcome back to Auréa!');
      // Navigate to dashboard
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error);
      handleAuthError(error);
    },
  });
};