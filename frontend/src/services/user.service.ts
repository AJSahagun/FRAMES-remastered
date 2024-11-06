import { apiClient } from './api.service';
import { UserRegistrationData, ApiResponse } from '../types/user.types';
import { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

export class UserService {
  static async registerUser(data: UserRegistrationData): Promise<ApiResponse<UserRegistrationData>> {
    try {
      const response = await apiClient.post<ApiResponse<UserRegistrationData>>(
        API_CONFIG.ENDPOINTS.USER,
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Registration Error:', error.response?.data || error.message);
      }
      throw error;
    }
  }
}