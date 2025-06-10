import express from 'express';
import db from '../db/init-sqlite';

const router = express.Router();

// Basic test route
router.get('/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Odyssey Backend!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Neon DB test route
router.get('/hello-db', async (req, res) => {
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
});

// Database health check
router.get('/db-health', async (req, res) => {
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
});

// Routes will be added here as we build them
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/messages', messageRoutes);

export default router; 