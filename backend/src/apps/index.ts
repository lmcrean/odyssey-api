import express from 'express';
import healthRoutes from './health/routes';
import userRoutes from './user/routes';
import authRoutes from './auth/routes';

const router = express.Router();

// App routes
router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Future app routes will be added here:
// router.use('/chat', chatRoutes);

export default router; 