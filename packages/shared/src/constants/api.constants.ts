/**
 * Shared API constants used across the application
 */

// API Response Messages
export const API_MESSAGES = {
  HEALTH: 'Hello World from C# API!',
  HEALTH_STATUS: 'Hello World from Competitor Analysis API',
  ROOT: 'API is running'
} as const;

// API Version
export const API_VERSION = '1.0.0';

// Application Title
export const APP_TITLE = 'Competitor Analysis Dashboard';

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  HEALTH_STATUS: '/api/health/status',
  ROOT: '/'
} as const;

// Default URLs for different environments
export const DEFAULT_URLS = {
  API: {
    LOCAL: 'http://localhost:5000',
    PRODUCTION: 'https://competitor-analysis-api-329000596728.us-central1.run.app'
  },
  WEB: {
    LOCAL: 'http://localhost:4200',
    PRODUCTION: 'https://your-firebase-app.web.app' // Update with actual production URL
  }
} as const;

// Test Timeouts
export const TEST_TIMEOUTS = {
  API_RESPONSE: 10000,
  PAGE_LOAD: 30000,
  ELEMENT_VISIBLE: 5000
} as const;