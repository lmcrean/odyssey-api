import { Request, Response } from 'express';
import db from '../../../../shared/db/init-sqlite';

export class DbHealthController {
  static async getDbHealth(req: Request, res: Response) {
    try {
      await db.raw('SELECT 1');
      res.json({
        status: 'ok',
        database: process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'SQLite',
        message: 'Database connection successful',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Database health check failed:', error);
      res.status(500).json({
        status: 'error',
        database: process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'SQLite',
        message: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 