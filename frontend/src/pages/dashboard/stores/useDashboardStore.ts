import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardFilters {
  month: string;
  year: string;
  searchTerm: string;
}

interface DashboardStore {
  filters: DashboardFilters;
  setMonth: (month: string) => void;
  setYear: (year: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  resetFilters: () => void;
}

const initialState: DashboardFilters = {
  month: new Date().toLocaleString('default', { month: 'long' }),
  year: new Date().getFullYear().toString(),
  searchTerm: ''
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      filters: initialState,
      setMonth: (month) => set((state) => ({ 
        filters: { ...state.filters, month } 
      })),
      setYear: (year) => set((state) => ({ 
        filters: { ...state.filters, year } 
      })),
      setSearchTerm: (searchTerm) => set((state) => ({ 
        filters: { ...state.filters, searchTerm } 
      })),
      resetFilters: () => set({ filters: initialState })
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({ filters: state.filters })
    }
  )
);