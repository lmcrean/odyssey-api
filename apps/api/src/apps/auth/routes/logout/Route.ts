import express from 'express';
import { LogoutController } from './Controller';

const router = express.Router();

// Logout route
router.post('/', LogoutController.logout);

export default router; 