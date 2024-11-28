import axios, { AxiosError } from 'axios';
import { apiClient } from './api.service';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_CONFIG } from '../config/api.config';
import { AuthState, LoginResponse } from '../types/auth.types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      
      login: async (credentials) => {
        try {
          const response = await apiClient.post<LoginResponse>(
            API_CONFIG.ENDPOINTS.LOGIN, 
            credentials
          );
          
          set({ 
            token: response.data.token,
            user: { 
              username: credentials.username, 
              role: 'faculty' // Default role
            } 
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            throw new Error(errorMessage);
          }
          throw error;
        }
      },
      
      logout: () => {
        set({ token: null, user: null });
      },
      
      isAuthenticated: () => {
        const { token } = get();
        return !!token;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user
      })
    }
  )
);

// Axios interceptor to add token to requests
export const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};