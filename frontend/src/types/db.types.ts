type Encodings = {
  id?: number;
  name: string;
  school_id: string;
  encoding: number[];
  date_created: string;
};

type Occupants = {
  id?: number;
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

export interface History {
  time_in: string;
  time_out: string;
}

// Data for table
export interface HistoryResponse {
  school_id: string;
  name: string;
  department: string;
  program: string;
  history: History[];
}

// Config for pie chart color per department
export interface departmentConfig {
  department: string;
  color?: string;
}

// Data for Pie chart, line graph, and CSV
export interface monthlySummaryResponse extends departmentConfig {
  month: string;
  year: string;
  program: string;
  visitors: string;
  dailyVisitors: {
    [day: string]: number;
  };
}

export interface QueryRequest{
  month:number | null
  year:number | null
}
