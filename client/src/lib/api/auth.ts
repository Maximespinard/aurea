import { apiClient } from '@/lib/api';
import type { RegisterFormValues } from '@/features/Register/register.schema';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  access_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  access_token: string;
}

export const authApi = {
  async register(data: RegisterFormValues): Promise<RegisterResponse> {
    const requestData: RegisterRequest = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    
    const response = await apiClient.post<RegisterResponse>('/auth/register', requestData);
    return response.data;
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
  },
};