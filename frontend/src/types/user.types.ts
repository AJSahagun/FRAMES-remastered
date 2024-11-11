export interface UserRegistrationData {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  srCode: string;
  department: string;
  program: string;
  encoding: number[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}