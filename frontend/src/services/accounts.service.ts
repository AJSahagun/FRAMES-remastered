import { apiClient } from "./api.service";
import { AxiosError } from "axios";
import { AccountsResponse } from "@/types/accounts.type";
import { API_CONFIG } from "../config/api.config";  // No need to import getAccountEndpoint
import { useAuthStore } from "./auth.service"; 

export class AccountService {
  static async getAccounts(): Promise<AccountsResponse[]> {
    try {
      const response = await apiClient.get<AccountsResponse[]>(API_CONFIG.ENDPOINTS.ACCOUNTS);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching accounts data:", error.response?.data || error.message);
      }
      throw error;
    }
  }

  static async createAccount(accountData: AccountsResponse): Promise<AccountsResponse> {
    try {
      const response = await apiClient.post<AccountsResponse>(API_CONFIG.ENDPOINTS.ACCOUNTS, accountData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error creating account:", error.response?.data || error.message);
      }
      throw error;
    }
  }

  static async updateAccount(username: string, accountData: Partial<AccountsResponse>): Promise<AccountsResponse> {
    try {
      const token = useAuthStore.getState().token; 
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; 
      const response = await apiClient.patch<AccountsResponse>(
        API_CONFIG.ENDPOINTS.UPDATE_DELETE_ACCOUNT.replace(':username', username), 
        accountData, 
        { headers }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error updating account:", error.response?.data || error.message);
      }
      throw error;
    }
  }
  
  static async deleteAccount(username: string): Promise<void> {
    try {
      const token = useAuthStore.getState().token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await apiClient.delete(
        API_CONFIG.ENDPOINTS.UPDATE_DELETE_ACCOUNT.replace(':username', username), 
        { headers }
      );
      console.log(`Account with username ${username} has been deleted successfully.`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error deleting account:", error.response?.data || error.message);
      }
      throw error;
    }
  }
}
