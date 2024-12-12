export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  API_KEY: import.meta.env.VITE_API_KEY || "",
  ENDPOINTS: {
    USER: "/api/v2/user",
    ACCESS: "/api/v2/history",
    HISTORY: "/api/v2/history/query",
    LOGIN: "/api/v2/auth/login",
    ALL_PROGRAM_MONTH_BY_DAY: "/api/v2/dashboard/all-program-month-by-day",
    ACCOUNTS: "/api/v2/auth/accounts",
    UPDATE_DELETE_ACCOUNT: "/api/v2/auth/accounts/:username",
    MAX_OCCUPANTS: "/api/v2/configuration/max-occupants",
    TOS: "/api/v2/configuration/tos",
    CONFIGURATION: "/api/v2/configuration",
  },
} as const;
