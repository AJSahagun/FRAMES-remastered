import { apiClient } from './api.service';
import { UserRegistrationData, ApiResponse } from '../types/user.types';
import { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

export class UserService {
  static async registerUser(data: UserRegistrationData): Promise<ApiResponse<UserRegistrationData>> {
    try {
      // Map data to backend format
      const backendData = mapToBackend(data);

      const response = await apiClient.post<ApiResponse<Omit<UserRegistrationData, 'userCode'> & { schoolId: string }>>(
        API_CONFIG.ENDPOINTS.USER,
        backendData
      );

      // Map response data to frontend format
      const frontendData = mapToFrontend(response.data.data);

      return {
        ...response.data,
        data: frontendData,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Registration Error:', error.response?.data || error.message);
      }
      throw error;
    }
  }
}

// Utility functions for data transformation
const mapToBackend = (data: UserRegistrationData): Omit<UserRegistrationData, 'userCode'> & { schoolId: string } => {
  const { userCode, ...rest } = data;
  return {
    ...rest,
    schoolId: userCode,
  };
};

const mapToFrontend = (data: Omit<UserRegistrationData, 'userCode'> & { schoolId: string }): UserRegistrationData => {
  const { schoolId, ...rest } = data;
  return {
    ...rest,
    userCode: schoolId,
  };
};
