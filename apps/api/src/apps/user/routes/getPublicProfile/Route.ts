import express from 'express';
import { getPublicProfileController } from './Controller';

const router = express.Router();

// GET /users/public/:identifier - Get public profile by username or ID
router.get('/:identifier', getPublicProfileController);

export default router; 