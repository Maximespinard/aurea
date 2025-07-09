import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { handleAuthError } from '@/lib/error-utils';

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store the access token
      localStorage.setItem('access_token', data.access_token);
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