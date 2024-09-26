import { create } from 'zustand';

interface UserFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  srCode: string;
  department: string;
  course: string;
  encoding: number[];
}

interface RegistrationState {
  formData: UserFormData;
  localFormData: UserFormData;
  isFormValid: boolean;
  isEditing: boolean;
  setFormData: (data: Partial<UserFormData>) => void;
  setLocalFormData: (data: Partial<UserFormData>) => void;
  setIsFormValid: (isValid: boolean) => void;
  submitForm: () => void;
  setIsEditing: (isEditing: boolean) => void;
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
  encoding: []
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  formData: initialFormData,
  localFormData: initialFormData,
  isFormValid: false,
  isEditing: false,
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data },
  })),
  setLocalFormData: (data) => set((state) => ({
    localFormData: { ...state.localFormData, ...data },
  })),
  setIsFormValid: (isValid) => set({ isFormValid: isValid }),
  submitForm: () => set((state) => ({
    formData: state.localFormData,
  })),
  setIsEditing: (isEditing) => set({ isEditing }),
  resetForm: () => set({ formData: initialFormData, localFormData: initialFormData, isFormValid: false}),
}));