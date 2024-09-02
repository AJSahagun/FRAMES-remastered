import { Pool } from 'pg';
import { Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT, 10),
      });

      return pool;
    },
  },
];
