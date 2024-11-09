import { create } from 'zustand';
import * as Yup from 'yup';
import { UserRegistrationData } from '../../../types/user.types';

interface FormState {
  isFormValid: boolean;
  validationErrors: Record<string, string>;
  validateForm: (formData: UserRegistrationData) => void;
  setIsFormValid: (isValid: boolean) => void;
  setValidationErrors: (errors: Record<string, string>) => void;
}

const userCodeRegex = /^(2\d-\d{5}$|P-\d{5})$/;
export const srCodeRegex = /^(2\d-\d{5}$)/;

export const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  middleName: Yup.string(),
  lastName: Yup.string().required('Last Name is required'),
  suffix:  Yup.string(),
  userCode: Yup.string()
    .required('This field is required')
    .matches(userCodeRegex, 'Example format: "20-12345" or "P-12345"')
    .test(
      'is-valid-format',
      'SR-CODE format: 24-12345, Employee ID format: P-12345',
      value => {
        return /^2\d-\d{5}$/.test(value) || /^P-\d{5}$/.test(value);
      }
    ),
    department: Yup.string().when('userCode', {
      is: (userCode: string | undefined) => srCodeRegex.test(userCode || ''),
      then: schema => schema.required('Department is required'),
      otherwise: schema => schema.notRequired(),
    }),
    program: Yup.string().when('userCode', {
      is: (userCode: string | undefined) => srCodeRegex.test(userCode || ''),
      then: schema => schema.required('Program is required'),
      otherwise: schema => schema.notRequired(),
    }),
});

export const useFormStore = create<FormState>((set) => ({
  isFormValid: false,
  validationErrors: {},
  validateForm: (formData) => {
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      set({ isFormValid: true, validationErrors: {} });
    } catch (err) {
      const errors = (err as Yup.ValidationError).inner.reduce((acc: Record<string, string>, error: Yup.ValidationError) => {
        acc[error.path!] = error.message;
        return acc;
      }, {});
      set({ isFormValid: false, validationErrors: errors });
    }
  },
  setIsFormValid: (isValid) => set({ isFormValid: isValid }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
}));