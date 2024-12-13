import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AccountService } from "@/services/accounts.service";
import { AccountsResponse } from "@/types/accounts.type";

interface AccountState {
  accounts: AccountsResponse[];
  filteredAccounts: AccountsResponse[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  applyFilters: () => void;
  isLoading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      accounts: [],
      filteredAccounts: [],
      searchTerm: "",
      isLoading: false,
      error: null,

      fetchAccounts: async () => {
        set({ isLoading: true, error: null });
        try {
          const accounts = await AccountService.getAccounts();
          set({ accounts, filteredAccounts: accounts, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || "Failed to fetch accounts", isLoading: false });
        }
      },

      setSearchTerm: (searchTerm) => {
        set({ searchTerm });
        get().applyFilters();
      },

      applyFilters: () => {
        const { accounts, searchTerm } = get();
        const lowercasedTerm = searchTerm.toLowerCase();

        const filteredAccounts = accounts.filter(
          (account) =>
            account.username.toLowerCase().includes(lowercasedTerm)
        );
        set({ filteredAccounts });
      },
    }),
    {
      name: "account-store",
      partialize: (state) => ({
        accounts: state.accounts,
        searchTerm: state.searchTerm,
      }),
    }
  )
);
