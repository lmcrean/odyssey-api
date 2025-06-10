import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';

// Import route modules (to be created later)
import routes from './routes/index';

// Load environment variables
dotenv.config();

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Check for required environment variables in production
if (isProduction && isVercel) {
  const requiredEnvVars = ['DATABASE_URL'];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
    process.exit(1);
  }
}

// Create Express app
const app = express();
const isMac = process.platform === 'darwin';
const PORT = process.env.PORT || (isMac ? 5001 : 5000);

// Determine environment
const isDevelopment = process.env.NODE_ENV !== 'production';

// Middleware
app.use(express.json());
app.use(cookieParser());

const devPorts = [3000, 3001, 3005, 5001, 5005, 5173];

const devOrigins = devPorts.flatMap(port => [
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`
]);

// Configure CORS
const corsOptions = {
  origin: isDevelopment
    ? devOrigins
    : [
        'https://odyssey-lmcreans-projects.vercel.app',
        'https://odyssey-api-lmcreans-projects.vercel.app',
      ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Enable pre-flight for all routes
app.options('*', cors(corsOptions));

// Routes
app.use('/api', routes);

// Health check for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Odyssey Backend is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`Error: ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({ error: message });
});

// Start the server if we're running directly
const __filename = fileURLToPath(import.meta.url);
const isMainModule = __filename === process.argv[1];

// Only start server when run directly (not when imported for testing)
if (isMainModule) {
  // Start server
  app.listen(PORT, () => {
    console.log(
      `🚀 Odyssey Backend running on port ${PORT} in ${
        process.env.NODE_ENV || 'development'
      } mode`
    );
  });
} else {
  console.log('Exporting server app for serverless deployment');
}

export default app; 