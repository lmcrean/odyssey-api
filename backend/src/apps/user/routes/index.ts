import express from 'express';
import profileRoute from './profile/Route';

const router = express.Router();

// User routes
router.use('/profile', profileRoute);

// Future user routes will be added here:
// router.use('/settings', settingsRoute);
// router.use('/preferences', preferencesRoute);

export default router; 