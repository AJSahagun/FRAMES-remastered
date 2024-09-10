import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { neon } from '@neondatabase/serverless';

// Load Environment Variables
config()

const sql = neon(process.env.FRAMES_DB_URL);

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}