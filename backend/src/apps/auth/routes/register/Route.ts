import express from 'express';
import { RegisterController } from './Controller';

const router = express.Router();

// Register route
router.post('/', RegisterController.register);

export default router; 