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
