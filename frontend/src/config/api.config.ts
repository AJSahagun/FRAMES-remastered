export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  API_KEY: import.meta.env.VITE_API_KEY || '',
  ENDPOINTS: {
    USER: '/api/v2/user',
    HISTORY: '/api/v2/history',
    LOGIN: '/api/v2/login'
  },
} as const;