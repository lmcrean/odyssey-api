# End-to-End Tests

This directory contains end-to-end tests for the Competitor Analysis Dashboard application using Playwright.

## Structure

```
e2e-tests/
├── tests/                  # Test files
│   ├── hello-world.spec.ts # Hello world flow tests
│   └── api-health.spec.ts  # API health check tests
├── fixtures/               # Test fixtures and data
│   └── test-data.ts       # Test data and constants
├── utils/                 # Test utilities
│   └── helpers.ts         # Common test helpers
├── package.json           # Dependencies
├── playwright.config.ts   # Playwright configuration
└── README.md             # This file
```

## Test Scenarios

### Hello World Flow
- ✅ Angular app loads successfully
- ✅ API connection is established
- ✅ Hello world message is displayed
- ✅ Health status is retrieved and shown
- ✅ Error handling when API is unavailable

### API Health Checks
- ✅ API endpoints respond correctly
- ✅ CORS is properly configured
- ✅ Response format validation

## Running Tests

### All Tests
```bash
cd e2e-tests
npm test
```

### Specific Test
```bash
npm run test:hello-world
```

### Headed Mode (with browser UI)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

## Test Environment
- Tests run against local development servers
- API: http://localhost:5000
- Web: http://localhost:4200
- Automatic server startup/shutdown
- Parallel test execution supported

## Configuration
- Cross-browser testing (Chromium, Firefox, Safari)
- Mobile device simulation
- Screenshot capture on failure
- Video recording for failed tests
- Retry mechanism for flaky tests