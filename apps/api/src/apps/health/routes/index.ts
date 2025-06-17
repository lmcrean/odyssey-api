import express from 'express';
import helloRoute from './hello/Route';
import helloDbRoute from './hello-db/Route';
import dbHealthRoute from './db-health/Route';

const router = express.Router();

// Health check routes
router.use('/hello', helloRoute);
router.use('/hello-db', helloDbRoute);
router.use('/db-health', dbHealthRoute);

export default router; 