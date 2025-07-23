import { 
  API_MESSAGES, 
  API_VERSION, 
  APP_TITLE, 
  DEFAULT_URLS, 
  TEST_TIMEOUTS,
  HealthResponse 
} from '@odyssey/shared';

// Configuration that adapts to environment (local vs production)
const getApiUrl = () => {
  return process.env.API_DEPLOYMENT_URL || 
         process.env.CLOUD_RUN_URL || 
         DEFAULT_URLS.API.LOCAL;
};

const getWebUrl = () => {
  return process.env.WEB_DEPLOYMENT_URL || 
         process.env.FIREBASE_HOSTING_URL || 
         DEFAULT_URLS.WEB.LOCAL;
};

export const TEST_DATA = {
  API: {
    BASE_URL: getApiUrl(),
    EXPECTED_HEALTH_MESSAGE: API_MESSAGES.HEALTH,
    EXPECTED_STATUS_MESSAGE: API_MESSAGES.HEALTH_STATUS,
    EXPECTED_VERSION: API_VERSION
  },
  WEB: {
    BASE_URL: getWebUrl(),
    TITLE: APP_TITLE
  },
  MESSAGES: {
    LOADING: 'Loading...',
    API_CONNECTION_TEST: 'API Connection Test',
    HELLO_WORLD_MESSAGE: 'Hello World Message',
    API_STATUS: 'API Status'
  },
  TIMEOUTS: TEST_TIMEOUTS
};

export const MOCK_RESPONSES = {
  HEALTH: API_MESSAGES.HEALTH,
  HEALTH_STATUS: {
    message: API_MESSAGES.HEALTH_STATUS,
    version: API_VERSION,
    timestamp: '2024-01-01T00:00:00.000Z'
  } as HealthResponse,
  ERROR: {
    message: 'Internal Server Error',
    status: 500
  }
};

export const USER_SCENARIOS = {
  HAPPY_PATH: {
    name: 'Happy Path - API Available',
    description: 'User visits the app and API is working correctly'
  },
  API_ERROR: {
    name: 'API Error - Connection Failed',
    description: 'User visits the app but API is unavailable'
  },
  SLOW_API: {
    name: 'Slow API - Performance Testing',
    description: 'API responses are slow but eventually succeed'
  },
  RETRY_FLOW: {
    name: 'Retry Flow - Error Recovery',
    description: 'User encounters error and uses retry button'
  }
};