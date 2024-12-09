import { create } from 'zustand';

interface LoginState {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  resetLoginForm: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  username: '',
  password: '',
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  resetLoginForm: () => set({ username: '', password: '' }),
}));
