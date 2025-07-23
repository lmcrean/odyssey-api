"use strict";
/**
 * Shared API constants used across the application
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_TIMEOUTS = exports.DEFAULT_URLS = exports.API_ENDPOINTS = exports.APP_TITLE = exports.API_VERSION = exports.API_MESSAGES = void 0;
// API Response Messages
exports.API_MESSAGES = {
    HEALTH: 'Hello World from C# API!',
    HEALTH_STATUS: 'Hello World from Competitor Analysis API',
    ROOT: 'API is running'
};
// API Version
exports.API_VERSION = '1.0.0';
// Application Title
exports.APP_TITLE = 'Competitor Analysis Dashboard';
// API Endpoints
exports.API_ENDPOINTS = {
    HEALTH: '/api/health',
    HEALTH_STATUS: '/api/health/status',
    ROOT: '/'
};
// Default URLs for different environments
exports.DEFAULT_URLS = {
    API: {
        LOCAL: 'http://localhost:5000',
        PRODUCTION: 'https://competitor-analysis-api-329000596728.us-central1.run.app'
    },
    WEB: {
        LOCAL: 'http://localhost:4200',
        PRODUCTION: 'https://your-firebase-app.web.app' // Update with actual production URL
    }
};
// Test Timeouts
exports.TEST_TIMEOUTS = {
    API_RESPONSE: 10000,
    PAGE_LOAD: 30000,
    ELEMENT_VISIBLE: 5000
};
