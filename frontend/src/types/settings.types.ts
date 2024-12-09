export interface MaxOccupantsRequest {
  max_occupants: number;
}

export interface TOSRequest {
  tos: string;
}

export interface MaxOccupantsResponse {
  max_occupants: number;
  updated_at?: string;
}

export interface TOSResponse {
  tos: string;
  updated_at?: string;
}
