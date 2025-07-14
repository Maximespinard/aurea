import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Clear auth state from Zustand store
      const { logout } = useAuthStore.getState();
      logout();

      // Redirect to signin page
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);
