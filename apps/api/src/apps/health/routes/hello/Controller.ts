import { Request, Response } from 'express';

export class HelloController {
  static async getHello(req: Request, res: Response) {
    try {
      res.json({ 
        message: 'Hello from Odyssey Backend!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Hello endpoint error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process hello request'
      });
    }
  }
} 