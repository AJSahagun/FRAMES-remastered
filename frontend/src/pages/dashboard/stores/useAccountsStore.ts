import { create } from "zustand";
import { AccountService } from "@/services/accounts.service";
import { AccountsResponse } from "@/types/accounts.type";

interface AccountState {
  accounts: AccountsResponse[];
  isLoading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  addAccount: (newAccount: AccountsResponse) => Promise<void>;
  updateAccount: (username: string, updatedAccount: Partial<AccountsResponse>) => Promise<void>;
  deleteAccount: (username: string) => Promise<void>;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  isLoading: false,
  error: null,

  fetchAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const accounts = await AccountService.getAccounts();
      set({ accounts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch accounts", isLoading: false });
    }
  },

  addAccount: async (newAccount) => {
    set({ isLoading: true, error: null });
    try {
      const createdAccount = await AccountService.createAccount(newAccount);
      set((state) => ({ accounts: [...state.accounts, createdAccount], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message || "Failed to add account", isLoading: false });
    }
  },

  updateAccount: async (username, updatedAccount) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await AccountService.updateAccount(username, updatedAccount);
      set((state) => ({
        accounts: state.accounts.map((account) =>
          account.username === username ? updated : account
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update account", isLoading: false });
    }
  },

  deleteAccount: async (username) => {
    set({ isLoading: true, error: null });
    try {
      await AccountService.deleteAccount(username);
      set((state) => ({
        accounts: state.accounts.filter((account) => account.username !== username),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete account", isLoading: false });
    }
  },
}));
