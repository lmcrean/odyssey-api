import { Knex } from 'knex';
import { DatabaseConfig } from '../types/index.js';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Use Neon DB (PostgreSQL) if DATABASE_URL is provided, otherwise fallback to SQLite
const config: DatabaseConfig = process.env.DATABASE_URL ? {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
} : {
  client: 'sqlite3',
  connection: {
    filename: isDevelopment ? './dev.sqlite3' : ':memory:'
  },
  useNullAsDefault: true
};

export default config; 