import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useAuthCheck = () => {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check authentication status when the app loads
    checkAuth();
  }, [checkAuth]);

  return { isAuthenticated };
};