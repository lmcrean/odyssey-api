import express from 'express';

const router = express.Router();

// Basic test route
router.get('/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Odyssey Backend!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes will be added here as we build them
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/messages', messageRoutes);

export default router; 