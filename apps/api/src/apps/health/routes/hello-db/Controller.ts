import { Request, Response } from 'express';
import db from '../../../../shared/db/init-sqlite';

export class HelloDbController {
  static async getHelloDb(req: Request, res: Response) {
    try {
      // Try to get a message from the database
      const message = await db('messages')
        .select('content')
        .where('content', 'like', '%Hello World from Neon DB!%')
        .first();

      if (message) {
        res.json({
          message: message.content,
          source: 'Neon DB',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        });
      } else {
        // Fallback message if no database message found
        res.json({
          message: 'Hello World from Neon DB!',
          source: 'Neon DB (fallback)',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        error: 'Database connection failed',
        message: 'Could not connect to Neon DB',
        fallback: 'Hello World from Neon DB! (error fallback)',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 