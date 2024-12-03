import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  monthlySummaryResponseData,
  visitorHistoryData
} from "@/data/dashboard-mockdata";

import { 
  transformMonthlySummaryData, 
  transformDailyVisitorData, 
  transformLibraryUserData 
} from '@/utils/dashboard-transformers';
import { DashboardFilters, DailyVisitorEntry, MonthlyVisitorSummary, LibraryUser } from "@/types/dashboard.types";

interface DashboardStore {
  filters: DashboardFilters;
  setMonth: (month: string) => void;
  setYear: (year: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  resetFilters: () => void;
  filteredVisitorData: DailyVisitorEntry[];
  filteredVisitorSummaryData: MonthlyVisitorSummary[];
  filteredLibraryUserData: LibraryUser[];
  applyFilters: () => void;
}

const initialState: DashboardFilters = {
  month: new Date().toLocaleString("default", { month: "long" }),
  year: new Date().getFullYear().toString(),
  searchTerm: "",
};

const transformedSummary = transformMonthlySummaryData(monthlySummaryResponseData);
const transformedDailyVisitors = transformDailyVisitorData(transformedSummary);
const transformedLibraryUsers = transformLibraryUserData(visitorHistoryData);

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      filters: initialState,
      filteredVisitorSummaryData: transformedSummary,
      filteredVisitorData: transformedDailyVisitors,
      filteredLibraryUserData: transformedLibraryUsers,

      setMonth: (month) => {
        set((state) => ({
          filters: { ...state.filters, month },
        }));
        get().applyFilters();
      },

      setYear: (year) => {
        set((state) => ({
          filters: { ...state.filters, year },
        }));
        get().applyFilters();
      },

      setSearchTerm: (searchTerm) => {
        set((state) => ({
          filters: { ...state.filters, searchTerm },
        }));
        get().applyFilters();
      },

      resetFilters: () => {
        set({ filters: initialState });
        get().applyFilters();
      },

      applyFilters: () => {
        const { month, year, searchTerm } = get().filters;

        const filteredVisitorData = transformedDailyVisitors.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.toLocaleString("default", { month: "long" }) === month &&
            itemDate.getFullYear().toString() === year
          );
        });

        const filteredVisitorSummaryData = transformedSummary.filter(
          (item) => item.month === month && item.year === year
        );

        const filteredLibraryUserData = transformedLibraryUsers.filter(user => {
          const userDate = new Date(user.timeIn);
          
          const matchesMonthYear = 
            userDate.toLocaleString('default', { month: 'long' }) === month &&
            userDate.getFullYear().toString() === year;
          
          const matchesSearchTerm = Object.values(user).some(value => 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          return matchesMonthYear && matchesSearchTerm;
        });

        set({
          filteredVisitorData,
          filteredVisitorSummaryData,
          filteredLibraryUserData,
        });
      },
    }),
    {
      name: "dashboard-storage",
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
