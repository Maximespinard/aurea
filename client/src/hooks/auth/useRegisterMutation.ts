import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { handleAuthError } from '@/lib/error-utils';

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      // Show success toast
      toast.success(
        'Account created successfully! Please sign in to continue.'
      );
      // Navigate to signin page
      navigate('/signin');
    },
    onError: (error: unknown) => {
      console.error('Registration failed:', error);
      handleAuthError(error);
    },
  });
};
