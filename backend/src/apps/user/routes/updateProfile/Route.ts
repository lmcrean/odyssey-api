import express from 'express';
import { updateUserProfileController } from './Controller';

const router = express.Router();

// PUT /users/profile/update - Update current user's profile
router.put('/', updateUserProfileController);

export default router; 