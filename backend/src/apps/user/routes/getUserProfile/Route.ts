import express from 'express';
import { getUserProfileController } from './Controller';

const router = express.Router();

// GET /users/profile - Get current user's full profile
router.get('/', getUserProfileController);

export default router; 