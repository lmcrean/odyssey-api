export const TEST_DATA = {
  API: {
    BASE_URL: 'http://localhost:5000',
    EXPECTED_HEALTH_MESSAGE: 'Hello World from C# API!',
    EXPECTED_STATUS_MESSAGE: 'Hello World from Competitor Analysis API',
    EXPECTED_VERSION: '1.0.0'
  },
  WEB: {
    BASE_URL: 'http://localhost:4200',
    TITLE: 'Competitor Analysis Dashboard'
  },
  MESSAGES: {
    LOADING: 'Loading...',
    API_CONNECTION_TEST: 'API Connection Test',
    HELLO_WORLD_MESSAGE: 'Hello World Message',
    API_STATUS: 'API Status'
  },
  TIMEOUTS: {
    API_RESPONSE: 10000,
    PAGE_LOAD: 30000,
    ELEMENT_VISIBLE: 5000
  }
};

export const MOCK_RESPONSES = {
  HEALTH: 'Hello World from C# API!',
  HEALTH_STATUS: {
    message: 'Hello World from Competitor Analysis API',
    version: '1.0.0',
    timestamp: '2024-01-01T00:00:00.000Z'
  },
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