import express from 'express';
import healthRoutes from './health/routes';
import userRoutes from './user/routes';

const router = express.Router();

// App routes
router.use('/health', healthRoutes);
router.use('/users', userRoutes);

// Future app routes will be added here:
// router.use('/auth', authRoutes);
// router.use('/chat', chatRoutes);

export default router; 