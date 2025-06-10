import { Knex } from 'knex';
import { DatabaseConfig } from '../types/index.js';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: DatabaseConfig = {
  client: 'sqlite3',
  connection: {
    filename: isDevelopment ? './dev.sqlite3' : ':memory:'
  },
  useNullAsDefault: true
};

// For production, you might want to use a different database
// if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
//   config.client = 'pg';
//   config.connection = process.env.DATABASE_URL;
// }

export default config; 