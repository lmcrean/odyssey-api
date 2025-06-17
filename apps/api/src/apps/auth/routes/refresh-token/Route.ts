import express from 'express';
import { RefreshTokenController } from './Controller';

const router = express.Router();

// Refresh token route
router.post('/', RefreshTokenController.refreshToken);

export default router; 