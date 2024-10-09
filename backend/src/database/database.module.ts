import { Module, Global, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load Environment Variables
// Load Environment Variables
config({
  path: ['.env', '.env.production', '.env.local'],
});

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
