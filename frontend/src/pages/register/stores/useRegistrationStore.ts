import { create } from 'zustand';

interface UserFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  srCode: string;
  department: string;
  program: string;
  encoding: number[];
  imageUrl: string;
  imageUrl: string;
}

interface RegistrationState {
  formData: UserFormData;
  localFormData: UserFormData;
  setLocalFormData: (formData: UserFormData) => void;

  isFormValid: boolean;
  setIsFormValid: (isValid: boolean) => void;

  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedProgram: { value: string; label: string }[];
  setSelectedProgram: (options: { value: string; label: string }[]) => void;
  
  srCodeError: string;
  setFormData: (data: Partial<UserFormData>) => void;
  setSrCodeError: (error: string) => void;
  submitForm: () => void;
  resetForm: () => void;
}

const initialFormData: UserFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  srCode: "",
  department: "",
  course: "",
  encoding: [],
  imageUrl: ""
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  formData: initialFormData,
  localFormData: initialFormData,
  isFormValid: false,
  srCodeError: "",
  selectedDept: '',
  selectedProgram: [],
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data },
  })),
  setLocalFormData: (data) => set((state) => ({
    localFormData: { ...state.localFormData, ...data },
  })),
  setIsFormValid: (isValid) => set({ isFormValid: isValid }),
  setSrCodeError: (error) => set({ srCodeError: error }),
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
