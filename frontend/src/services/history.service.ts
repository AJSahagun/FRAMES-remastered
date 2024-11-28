import { apiClient } from './api.service';  // This will be your Axios instance for making API requests.
import { Occupants, ApiResponse } from '../types/db.types';
import { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

export class HistoryService {
  static async recordHistory(data:Occupants[]): Promise<ApiResponse<Occupants>> {
    try {
      const response = await apiClient.post<ApiResponse<Occupants>>(
        API_CONFIG.ENDPOINTS.HISTORY,
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('History Recording Error:', error.response?.data || error.message);
      }
      throw error; 
    }
  }

}
