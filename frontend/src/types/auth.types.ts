export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: "librarian" | "admin";
}

export interface AuthState {
  token: string | null;
  user: {
    username: string;
    role: "librarian" | "admin";
  } | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}
