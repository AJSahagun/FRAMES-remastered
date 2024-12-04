import { apiClient } from "./api.service";
import { AxiosError } from "axios";
import { AccountsResponse } from "@/types/accounts.type";
import { API_CONFIG } from "../config/api.config";

export class AccountService {
  // Fetch all accounts
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

  // Create a new account
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

  //Update an account
  static async updateAccount(username: string, accountData: Partial<AccountsResponse>): Promise<AccountsResponse> {
    try {
      const updatedUsername = accountData.username;

      if (updatedUsername && updatedUsername !== username) {
        const updatedData = { ...accountData };
        delete updatedData.username;  

        const response = await apiClient.patch<AccountsResponse>(API_CONFIG.ENDPOINTS.UPDATE_DELETE_ACCOUNTS.replace(':username', username), updatedData);

        return response.data;
      } else {
        const response = await apiClient.put<AccountsResponse>(API_CONFIG.ENDPOINTS.UPDATE_DELETE_ACCOUNTS.replace(':username', username), accountData);

        return response.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error updating account:", error.response?.data || error.message);
      }
      throw error;
    }
  }

  // Delete an account
  static async deleteAccount(username: string): Promise<void> {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.ACCOUNTS.replace(':username', username));
      console.log(`Account with username ${username} has been deleted successfully.`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error deleting account:", error.response?.data || error.message);
      }
      throw error;
    }
  }
}
