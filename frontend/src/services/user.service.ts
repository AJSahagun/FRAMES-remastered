import { apiClient } from './api.service';
import { UserRegistrationData, ApiResponse } from '../types/user.types';
import { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

export class UserService {
  static async registerUser(data: UserRegistrationData): Promise<ApiResponse<null>> {
    try {
      const backendData = mapToBackend(data);

      const response = await apiClient.post<ApiResponse<null>>(
        API_CONFIG.ENDPOINTS.USER,
        backendData
      );

      console.log('Backend response:', response.data);
      return response.data; // Simply return the backend response
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Registration Error:', error.response?.data || error.message);
      }
      throw error;
    }
  }
}

// Utility function for data transformation
const mapToBackend = (data: UserRegistrationData): Record<string, unknown> => {
  const { userCode, firstName, lastName, ...rest } = data;
  return {
    ...rest,
    first_name: firstName,
    last_name: lastName,
    school_id: userCode,
  };
};

