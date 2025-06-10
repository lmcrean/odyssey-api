import express from 'express';
import { getUserProfileController } from './Controller';
import { authenticateToken } from '../../../../shared/middleware/auth';

const router = express.Router();

// GET /users/profile - Get current user's full profile
router.get('/', authenticateToken, getUserProfileController);

export default router; 