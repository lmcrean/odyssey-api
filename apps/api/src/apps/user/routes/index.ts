import express from 'express';
import getUserProfileRoute from './getUserProfile/Route';
import updateProfileRoute from './updateProfile/Route';
import getPublicProfileRoute from './getPublicProfile/Route';
import searchUsersRoute from './searchUsers/Route';
import checkUsernameRoute from './checkUsername/Route';

const router = express.Router();

// User profile routes (unified user model)
router.use('/profile', getUserProfileRoute);
router.use('/profile', updateProfileRoute);
router.use('/public', getPublicProfileRoute);
router.use('/search', searchUsersRoute);
router.use('/check-username', checkUsernameRoute);

// Future user routes will be added here:
// router.use('/settings', settingsRoute);
// router.use('/preferences', preferencesRoute);

export default router; 