import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '@/services/auth.service';

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Store the access token
      localStorage.setItem('access_token', data.access_token);
      // Navigate to home page
      navigate('/');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};