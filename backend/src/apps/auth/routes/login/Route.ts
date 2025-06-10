import express from 'express';
import { LoginController } from './Controller';

const router = express.Router();

// Login route
router.post('/', LoginController.login);

export default router; 