// useRegistrationStore.ts
import { create } from 'zustand';
import { UserRegistrationData } from '../../../types/user.types';

interface RegistrationState {
  formData: UserRegistrationData;
  localFormData: UserRegistrationData;
  setLocalFormData: (data: Partial<UserRegistrationData>) => void;
  setFormData: (data: Partial<UserRegistrationData>) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedProgram: { value: string; label: string }[];
  setSelectedProgram: (options: { value: string; label: string }[]) => void;  
  userCodeError: string;
  setUserCodeError: (error: string) => void;
  submitForm: () => void;
  resetForm: () => void;
}

const initialFormData: UserRegistrationData = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  userCode: "",
  department: "",
  program: "",
  encoding: [],
  imageUrl: ""
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  formData: initialFormData,
  localFormData: initialFormData,
  setLocalFormData: (data) => set((state) => ({ localFormData: { ...state.localFormData, ...data } })),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  selectedDept: "",
  setSelectedDept: (dept) => set({ selectedDept: dept }),
  selectedProgram: [],
  setSelectedProgram: (options) => set({ selectedProgram: options }),
  userCodeError: "",
  setUserCodeError: (error) => set({ userCodeError: error }),
  submitForm: () => set((state) => ({ formData: state.localFormData })),
  resetForm: () => set({ localFormData: initialFormData })
}));