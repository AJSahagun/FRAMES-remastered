import { AxiosError } from "axios";
import { apiClient } from "./api.service";
import { API_CONFIG } from "../config/api.config";
import {
  MaxOccupantsRequest,
  TOSRequest,
  MaxOccupantsResponse,
  TOSResponse,
} from "@/types/settings.types";

export class SettingsService {
  static async getMaxOccupants(): Promise<MaxOccupantsResponse> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.MAX_OCCUPANTS);
      return { max_occupants: response.data };
    } catch (error) {
      this.handleError(error, "Error fetching max occupants configuration");
      throw error;
    }
  }

  static async updateMaxOccupants(
    request: MaxOccupantsRequest
  ): Promise<MaxOccupantsResponse> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.CONFIGURATION,
        request
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "Error updating max occupants configuration");
      throw error;
    }
  }

  static async getTOS(): Promise<TOSResponse> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.TOS);
      return { tos: response.data };
    } catch (error) {
      this.handleError(error, "Error fetching Terms of Service");
      throw error;
    }
  }

  static async updateTOS(request: TOSRequest): Promise<TOSResponse> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.CONFIGURATION,
        request
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "Error updating Terms of Service");
      throw error;
    }
  }

  private static handleError(error: unknown, context: string): void {
    if (error instanceof AxiosError) {
      console.error(context, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else if (error instanceof Error) {
      console.error(context, error.message);
    }
  }
}
