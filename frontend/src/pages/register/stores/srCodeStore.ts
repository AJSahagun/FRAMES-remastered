import { create } from 'zustand';

interface StoreState {
  srCodeError: string;
  setSrCodeError: (error: string) => void;
}

export const useSrCodeStore = create<StoreState>((set) => ({
  srCodeError: "",
  setSrCodeError: (error) => set({ srCodeError: error }),
}));