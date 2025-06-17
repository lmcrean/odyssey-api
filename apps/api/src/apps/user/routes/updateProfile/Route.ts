import express from 'express';
import { updateUserProfileController } from './Controller';
import { authenticateToken } from '../../../../shared/middleware/auth';

const router = express.Router();

// PUT /users/profile - Update current user's profile
router.put('/', authenticateToken, updateUserProfileController);

export default router; 