type Encodings = {
  id?: number;
  name: string;
  school_id: string;
  encoding: number[];
  date_created: string;
};

type Occupants = {
  id?: number
  name: string;
  school_id: string;
  time_in: string;
  time_out: string | null;  
};

type ResponseType = {
  message: string;
  newEncoding: EncodingResponse;
};

type EncodingResponse = {
  id_ai: number;
  date_created: string;
  name: string;
  encoding: number[];  
  school_id: string;
};

export type { Encodings, Occupants, ResponseType, EncodingResponse };

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}
