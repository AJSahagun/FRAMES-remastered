import { create } from "zustand";

interface PaginationState {
  currentPage: number;
  isFormValid: boolean;
  nextPage: () => void;
  prevPage: () => void;
  validateForm: (isValid: boolean) => void;
  setPage: (page: number) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  currentPage: 1,
  isFormValid: false,
  nextPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),
  prevPage: () => set((state) => ({ currentPage: state.currentPage - 1 })),
  validateForm: (isValid) => set({ isFormValid: isValid }),
  setPage: (page) => set({ currentPage: page }),
}));
