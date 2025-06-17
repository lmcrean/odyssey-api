import express from 'express';
import { HelloController } from './Controller';

const router = express.Router();

// Basic test route
router.get('/', HelloController.getHello);

export default router; 