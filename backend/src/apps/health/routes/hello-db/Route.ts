import express from 'express';
import { HelloDbController } from './Controller';

const router = express.Router();

// Database test route
router.get('/', HelloDbController.getHelloDb);

export default router; 