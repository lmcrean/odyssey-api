import express from 'express';
import { DbHealthController } from './Controller';

const router = express.Router();

// Database health check route
router.get('/', DbHealthController.getDbHealth);

export default router; 