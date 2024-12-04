import { apiClient } from "./api.service";
import { AxiosError } from "axios";
import { AccountsResponse } from "@/types/accounts.type";
import { API_CONFIG } from "../config/api.config";

export class AccountService {
  static async getAccounts(): Promise<AccountsResponse[]> {
    try {
      const response = await apiClient.get<AccountsResponse[]>(API_CONFIG.ENDPOINTS.ACCOUNTS);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error fetching accounts data:",
          error.response?.data || error.message
        );
      }
      throw error;
    }
  }

  static async createAccount(accountData: AccountsResponse): Promise<AccountsResponse> {
    try {
      const response = await apiClient.post<AccountsResponse>(
        API_CONFIG.ENDPOINTS.ACCOUNTS,
        accountData
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error creating account:", error.response?.data || error.message);
      }
      throw error;
    }
  }  
}
