export interface UserRegistrationData {
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

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
}