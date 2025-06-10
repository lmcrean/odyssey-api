# Production Testing Framework

## Overview
This directory contains a structured approach to production E2E testing using **runners** and **operations** pattern.

## Structure

```
production-testing/
├── runners/              # Orchestrate complete workflows
│   ├── auth-flow-runner.js       # Complete auth flows
│   └── user-generator-runner.js  # User generation logic
├── operations/           # Individual atomic actions
│   ├── config-operations.js      # Configuration & URLs
│   ├── health-operations.js      # Health checks & CORS
│   ├── screenshot-operations.js  # Screenshot utilities
│   ├── signin-operations.js      # Signin actions
│   └── signup-operations.js      # Signup actions
└── *.spec.js            # Test files using runners/operations
```

## Key Features

- ✅ **Signup Testing**: Random user registration on production
- ✅ **Signin Testing**: Authentication with registered users  
- ✅ **Complete Auth Flow**: Full signup → signin flow
- ✅ **Health Checks**: Backend connectivity & CORS verification
- ✅ **Screenshot Capture**: Visual verification at each step
- ✅ **Error Handling**: Graceful failure with error screenshots
- ✅ **Multiple Users**: Batch user testing

## Usage

### Run Signup Tests
```bash
npx playwright test auth-signup.spec.js --config=playwright-production.config.js
```

### Run Signin Tests  
```bash
npx playwright test auth-signin.spec.js --config=playwright-production.config.js
```

### Run Complete Auth Flow
```bash
npx playwright test auth-complete-flow.spec.js --config=playwright-production.config.js
```

### Run All Production Tests
```bash
npx playwright test --config=playwright-production.config.js
```

## Test Results

Recent successful test run:
- ✅ **Signup Test**: `prodtest1749381589167d5twpl` registered successfully
- ✅ **Invalid Data Handling**: Validation errors properly displayed
- ✅ **Backend Health**: All connectivity checks passed
- ✅ **CORS Configuration**: Cross-origin requests working
- ✅ **Screenshot Capture**: All visual checkpoints captured

## Key Benefits

1. **Modular Design**: Runners orchestrate, operations execute
2. **Reusable Components**: Share operations across different test flows  
3. **Clean Test Files**: Tests stay under 100 lines as requested
4. **Production Ready**: Tests actual live production environment
5. **Visual Documentation**: Screenshots captured at each step
6. **Error Recovery**: Graceful handling of failures with diagnostics

## Production URLs

- **Frontend**: `https://odyssey-frontend-lmcreans-projects.vercel.app`
- **Backend**: `https://odyssey-api-lmcreans-projects.vercel.app`

## Test Output Example

```
🚀 Checking deployment status...
✅ Backend health check passed
✅ CORS configuration verified
👤 Generated test user: prodtest1749381589167d5twpl
🎯 Running production signup for: prodtest1749381589167d5twpl
📍 Navigating to signup page...
✅ Navigation to signup successful
📸 Capturing viewport screenshot: 01-signup-page
📝 Filling signup form...
✅ Signup form filled
🚀 Submitting signup form...
✅ Signup form submitted
🔍 Verifying signup success...
✅ Signup success verified
🎉 SUCCESS: prodtest1749381589167d5twpl registered!
``` 