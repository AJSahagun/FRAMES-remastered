export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
    API_KEY: process.env.REACT_APP_API_KEY || '',
    ENDPOINTS: {
      USER: '/api/v1/user',
    },
  } as const;