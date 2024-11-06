import { create } from 'zustand';

interface UserFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  userCode: string;
  department: string;
  program: string;
  encoding: number[];
  imageUrl: string;
}

interface RegistrationState {
  formData: UserFormData;
  localFormData: UserFormData;
  setLocalFormData: (data: Partial<UserFormData>) => void;
  setFormData: (data: Partial<UserFormData>) => void;
  isFormValid: boolean;
  setIsFormValid: (isValid: boolean) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedProgram: { value: string; label: string }[];
  setSelectedProgram: (options: { value: string; label: string }[]) => void;  
  userCodeError: string;
  setUserCodeError: (error: string) => void;
  submitForm: () => void;
  resetForm: () => void;
}

const initialFormData: UserFormData = {
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
  isFormValid: false,
  userCodeError: "",
  selectedDept: '',
  selectedProgram: [],
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data },
  })),
  setLocalFormData: (data) => set((state) => ({
    localFormData: { ...state.localFormData, ...data },
  })),
  setIsFormValid: (isValid) => set({ isFormValid: isValid }),
  setUserCodeError: (error) => set({ userCodeError: error }),
  setSelectedDept: (dept) => set({ selectedDept: dept }),
  setSelectedProgram: (options) => set({ selectedProgram: options }),
  submitForm: () => set((state) => ({
    formData: state.localFormData,
  })),
  
  resetForm: () => set({ 
    formData: initialFormData, 
    localFormData: initialFormData, 
    isFormValid: false,
    selectedProgram: []
  }),
}));
