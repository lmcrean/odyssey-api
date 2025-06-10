import express from 'express';
import appRoutes from '../apps';

const router = express.Router();

// Use app-centric routes
router.use('/', appRoutes);

export default router; 