import express from 'express';
import loginRoutes from './login/Route';
import registerRoutes from './register/Route';
import refreshTokenRoutes from './refresh-token/Route';
import logoutRoutes from './logout/Route';

const router = express.Router();

// Auth routes
router.use('/login', loginRoutes);
router.use('/register', registerRoutes);
router.use('/refresh-token', refreshTokenRoutes);
router.use('/logout', logoutRoutes);

export default router; 