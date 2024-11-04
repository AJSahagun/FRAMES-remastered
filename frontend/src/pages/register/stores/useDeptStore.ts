// selectedDeptStore.ts
import { create } from 'zustand';

interface DeptState {
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
}

export const useDeptStore = create<DeptState>((set) => ({
  selectedDept: '',
  setSelectedDept: (dept) => set({ selectedDept: dept }),
}));
