import express from 'express';
import { searchUsersController } from './Controller';

const router = express.Router();

// GET /users/search?q=query&limit=20 - Search users by username or profile name
router.get('/', searchUsersController);

export default router; 