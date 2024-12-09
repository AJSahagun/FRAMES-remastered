import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DashboardService } from "@/services/dashboard.service";
import { toast } from "react-toastify";
import {
  DashboardFilters,
  DailyVisitorEntry,
  MonthlyVisitorSummary,
  LibraryUser,
  DepartmentColors,
} from "@/types/dashboard.types";
import {
  transformMonthlySummaryData,
  transformDailyVisitorData,
  transformLibraryUserData,
  extractDepartmentColors,
} from "@/utils/dashboard-transformers";

interface DashboardStore {
  filters: DashboardFilters;
  setMonth: (month: string) => void;
  setYear: (year: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  resetFilters: () => void;
  filteredVisitorData: DailyVisitorEntry[];
  filteredVisitorSummaryData: MonthlyVisitorSummary[];
  filteredLibraryUserData: LibraryUser[];
  departmentColors: DepartmentColors[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  applyFilters: () => void;
  loadDepartmentColors: () => DepartmentColors[];
  saveDepartmentColors: (updatedColors: DepartmentColors[]) => void;
  updateDepartmentColor: (name: string, color: string) => void;
}

const initialState: DashboardFilters = {
  month: new Date().toLocaleString("default", { month: "long" }),
  year: new Date().getFullYear().toString(),
  searchTerm: "",
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      filters: initialState,
      filteredVisitorSummaryData: [],
      filteredVisitorData: [],
      filteredLibraryUserData: [],
      departmentColors: [],
      isLoading: false,
      error: null,

      fetchDashboardData: async () => {
        const { month, year } = get().filters;
        set({ isLoading: true, error: null });

        try {
          const monthNumber =
            new Date(Date.parse(`${month} 1, 2024`)).getMonth() + 1;
          const yearNumber = parseInt(year);

          const monthlySummaryResponse =
            await DashboardService.getAllProgramMonthByDay({
              month: monthNumber,
              year: yearNumber,
            });

          const visitorHistoryResponse = await DashboardService.getHistory({
            month: monthNumber,
            year: yearNumber,
          });

          const backendColors = extractDepartmentColors(monthlySummaryResponse);
          const localColors = get().loadDepartmentColors();

          const mergedColors = backendColors.map((backendColor) => {
            const localColor = localColors.find(
              (color) => color.name === backendColor.name
            );
            return localColor || backendColor;
          });

          const transformedSummary = transformMonthlySummaryData(
            monthlySummaryResponse, localColors
          );

          const transformedDailyVisitors =
            transformDailyVisitorData(transformedSummary);

          const transformedLibraryUsers = transformLibraryUserData(
            visitorHistoryResponse
          );

          set({
            filteredVisitorSummaryData: transformedSummary,
            filteredVisitorData: transformedDailyVisitors,
            filteredLibraryUserData: transformedLibraryUsers,
            departmentColors: mergedColors,
            isLoading: false,
          });

          get().applyFilters();
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";

          set({ isLoading: false, error: errorMessage });
          toast.error(`${errorMessage}`);
        }
      },

      loadDepartmentColors: () => {
        const storedColors = localStorage.getItem("departmentColors");
        return storedColors ? JSON.parse(storedColors) : [];
      },

      saveDepartmentColors: (updatedColors: DepartmentColors[]) => {
        localStorage.setItem("departmentColors", JSON.stringify(updatedColors));
        set({ departmentColors: updatedColors });
      },

      updateDepartmentColor: (name: string, color: string) => {
        const currentColors = get().departmentColors;
        const updatedColors = currentColors.map((entry) =>
          entry.name === name ? { ...entry, color } : entry
        );

        get().saveDepartmentColors(updatedColors);
      },

      setMonth: (month) => {
        set((state) => ({
          filters: { ...state.filters, month },
        }));
        get().fetchDashboardData();
      },

      setYear: (year) => {
        set((state) => ({
          filters: { ...state.filters, year },
        }));
        get().fetchDashboardData();
      },

      setSearchTerm: (searchTerm) => {
        set((state) => ({
          filters: { ...state.filters, searchTerm },
        }));
        get().applyFilters();
      },

      resetFilters: () => {
        set({ filters: initialState });
        get().fetchDashboardData();
      },

      applyFilters: () => {
        const { month, year, searchTerm } = get().filters;

        const filteredVisitorData = get().filteredVisitorData.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.toLocaleString("default", { month: "long" }) === month &&
            itemDate.getFullYear().toString() === year
          );
        });

        const filteredVisitorSummaryData =
          get().filteredVisitorSummaryData.filter(
            (item) => item.month === month && item.year === year
          );

        const filteredLibraryUserData = get().filteredLibraryUserData.filter(
          (user) => {
            const userDate = new Date(user.timeIn);

            const matchesMonthYear =
              userDate.toLocaleString("default", { month: "long" }) === month &&
              userDate.getFullYear().toString() === year;

            const matchesSearchTerm = Object.values(user).some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );

            return matchesMonthYear && matchesSearchTerm;
          }
        );

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
