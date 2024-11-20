type Encodings = {
  name: string;
  schoolId: string;
  encoding: string;
};

type Occupants = {
  id: number;
  name: string;
  schoolId: string;
  timeIn: string;
  timeOut: string | null;  
};

type ResponseType = {
  message: string;
  newEncoding: EncodingResponse;
};

type EncodingResponse = {
  idAi: number;
  name: string;
  encoding: number[];  
  schoolId: string;
};

export type { Encodings, Occupants, ResponseType, EncodingResponse };

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}
