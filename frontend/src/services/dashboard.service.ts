import { apiClient } from "./api.service";
import { AxiosError } from "axios";
import {
  HistoryResponse,
  monthlySummaryResponse,
  QueryRequest,
} from "@/types/db.types";
import { API_CONFIG } from "../config/api.config";

export class DashboardService {
  static async getHistory(query: QueryRequest): Promise<HistoryResponse[]> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.HISTORY, {
        params: query,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error fetching history data:",
          error.response?.data || error.message
        );
      }
      throw error;
    }
  }

  static async getAllProgramMonthByDay(
    query: QueryRequest
  ): Promise<monthlySummaryResponse[]> {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.ALL_PROGRAM_MONTH_BY_DAY,
        {
          params: query,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error fetching all program month-by-day data:",
          error.response?.data || error.message
        );
      }
      throw error;
    }
  }
}
