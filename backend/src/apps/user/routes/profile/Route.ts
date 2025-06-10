import express from 'express';
import { ProfileController } from './Controller';

const router = express.Router();

// User profile routes
router.get('/', ProfileController.getProfile);
router.put('/', ProfileController.updateProfile);

export default router; 