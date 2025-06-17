import express from 'express';
import { checkUsernameController } from './Controller';

const router = express.Router();

// GET /users/check-username/:username - Check if username is available
router.get('/:username', checkUsernameController);

export default router; 