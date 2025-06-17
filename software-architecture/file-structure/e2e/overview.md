# E2E Testing Architecture - Playwright Runners Pattern

> **Testing Strategy**: Each endpoint = unique runner file, each app = dedicated folder

## Overview
Comprehensive end-to-end testing using Playwright with a **runners pattern** that provides modular, reusable, and maintainable test components. Each API endpoint gets its own runner class, organized by application domain.

## Current Structure (Backend-Focused)
```typescript
backend/e2e/
├── master-integration.spec.ts    # Main test orchestration
├── playwright.config.ts          # Playwright configuration
└── runners/
    ├── auth/                     # Authentication app runners
    │   ├── Login.ts              # POST /api/auth/login
    │   ├── Register.ts           # POST /api/auth/register
    │   ├── Logout.ts             # POST /api/auth/logout
    │   └── RefreshToken.ts       # POST /api/auth/refresh
    ├── user/                     # User management runners
    │   ├── GetUserProfile.ts     # GET /api/users/profile
    │   ├── UpdateProfile.ts      # PUT /api/users/profile
    │   ├── SearchUsers.ts        # GET /api/users/search
    │   ├── CheckUsername.ts      # GET /api/users/check-username
    │   └── GetPublicProfile.ts   # GET /api/users/:id/public
    ├── health/                   # Health check runners
    │   ├── HealthStatus.ts       # GET /api/health
    │   ├── DatabaseHealth.ts     # GET /api/health/db
    │   └── CorsCheck.ts          # OPTIONS preflight testing
    └── operations/               # Orchestrated test flows
        ├── AuthFlow.ts           # Complete auth user journey
        └── UserFlow.ts           # Complete user management flow
```

## Future Structure (Apps/Packages Architecture)
```typescript
odyssey/e2e/
├── master-integration.spec.ts    # Single test file that runs everything
├── playwright.config.ts          # Global Playwright config
└── runners/
    ├── auth/                     # Authentication domain
    │   ├── login.ts              # Login action runner
    │   ├── register.ts           # Register action runner
    │   └── logout.ts             # Logout action runner
    ├── content/                  # Content management domain
    │   ├── uploadImage.ts        # Upload image action runner
    │   ├── deleteContent.ts     # Delete content action runner
    │   └── viewContent.ts       # View content action runner
    ├── payments/                 # Payment processing domain
    │   ├── createPayment.ts     # Create payment action runner
    │   ├── processPayment.ts    # Process payment action runner
    │   └── confirmPayment.ts    # Confirm payment action runner
    ├── user/                    # User management domain
    │   ├── getProfile.ts        # Get profile action runner
    │   ├── updateProfile.ts     # Update profile action runner
    │   └── searchUsers.ts       # Search users action runner
    └── operations/              # Cross-domain orchestration
        ├── authFlow.ts          # Orchestrates login → register → logout
        ├── contentFlow.ts       # Orchestrates upload → view → delete
        ├── paymentFlow.ts       # Orchestrates payment → process → confirm
        └── creatorJourney.ts    # Full creator signup → upload → payment
```

## Testing Architecture Flow

### 🎭 **Single Test Entry Point**
```typescript
// master-integration.spec.ts - The ONLY .spec file
test('creator journey flow', async ({ page, request }) => {
  const creatorJourney = new CreatorJourneyOperation(page, request);
  await creatorJourney.execute();
});

test('payment processing flow', async ({ page, request }) => {
  const paymentFlow = new PaymentFlowOperation(page, request);  
  await paymentFlow.execute();
});
```

### 🔧 **Operations Orchestrate Runners**
```typescript
// operations/creatorJourney.ts
export class CreatorJourneyOperation {
  async execute() {
    // Use individual runners in sequence
    const auth = new RegisterRunner(this.page, this.request);
    const content = new UploadImageRunner(this.page, this.request);
    const payment = new CreatePaymentRunner(this.page, this.request);
    
    await auth.run();
    await content.run();  
    await payment.run();
  }
}
```

### ⚡ **Runners Execute Single Actions**
```typescript
// runners/auth/register.ts - No .test suffix!
export class RegisterRunner {
  constructor(private page: Page, private request: APIRequestContext) {}
  
  async run() {
    // Single action: user registration
    await this.page.goto('/register');
    await this.page.fill('[data-testid="email"]', 'test@example.com');
    await this.page.click('[data-testid="submit"]');
    // Return data for next runner
    return { userId: '123', token: 'abc' };
  }
}
```

## Runner Pattern Principles

### 1. **Action-Based Naming (No .test Suffix)**
```typescript
// Naming convention: {verb}{Object}.ts
login.ts              # Handles login action
register.ts           # Handles registration action  
uploadImage.ts        # Handles image upload action
createPayment.ts      # Handles payment creation action

// NOT .test.ts because they're not test files!
// They're action runners executed by operations
```

### 2. **Domain-Based Folder Organization**
```typescript
// All related tests in same domain folder
runners/
├── auth/              # Authentication domain
│   ├── login.ts
│   ├── register.ts
│   └── logout.ts
├── content/           # Content management domain
│   ├── uploadImage.ts
│   ├── deleteContent.ts
│   └── viewContent.ts
└── payments/          # Payment processing domain
    ├── createPayment.ts
    ├── processPayment.ts
    └── confirmPayment.ts
```

### 3. **Reusable & Composable Runners**
```typescript
// Each file exports a runner class
export class LoginApiRunner {
  constructor(private request: APIRequestContext) {}

  async runValidLogin() {
    const response = await this.request.post('/api/auth/login', {
      data: { email: 'test@example.com', password: 'TestPassword123!' }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    return { success: true, data };
  }
}

export class LoginWebRunner {
  constructor(private page: Page) {}

  async runValidLogin() {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="email"]', 'test@example.com');
    await this.page.fill('[data-testid="password"]', 'TestPassword123!');
    await this.page.click('[data-testid="login-button"]');
    
    await expect(this.page).toHaveURL('/dashboard');
    return { success: true };
  }
}
```

## Integration with Observability

### Request Correlation Across Apps
```typescript
// Each test generates correlation ID for tracing
export class PaymentIntegrationFlow {
  async runCrossAppPaymentFlow() {
    const correlationId = generateCorrelationId();
    
    // 1. Frontend: User initiates payment
    const frontendResult = await webRunner.initiatePayment({ correlationId });
    
    // 2. API: Creates payment intent
    const apiResult = await apiRunner.createPaymentIntent({ correlationId });
    
    // 3. Payments: Processes with Stripe
    const paymentResult = await paymentsRunner.processPayment({ correlationId });
    
    // 4. Verify all logs are correlated
    const logs = await observabilityRunner.getLogsByCorrelation(correlationId);
    expect(logs).toContain('frontend.payment.initiated');
    expect(logs).toContain('api.payment.created');
    expect(logs).toContain('payments.stripe.processed');
  }
}
```

## Testing Strategies

### 1. **Unit-Level Runners** (Individual Endpoints)
- Test single API endpoints in isolation
- Validate request/response formats
- Test error scenarios and edge cases
- Fast execution, focused assertions

### 2. **Integration-Level Operations** (Cross-App Flows)
- Test complete user journeys
- Validate data flow between apps
- Test real-world scenarios
- Comprehensive end-to-end validation

### 3. **Frontend Page Runners** (UI Interactions)
- Test user interface interactions
- Validate frontend/backend integration
- Test responsive design and accessibility
- Visual regression testing

## Configuration & Environment

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.api.test.ts',
      use: { 
        baseURL: 'http://localhost:3001' // API app URL
      }
    },
    {
      name: 'payments-tests', 
      testMatch: '**/*.payments.test.ts',
      use: { 
        baseURL: 'http://localhost:3002' // Payments app URL
      }
    },
    {
      name: 'web-tests',
      testMatch: '**/*.web.test.ts',
      use: { 
        baseURL: 'http://localhost:3000', // Web app URL
        browserName: 'chromium'
      }
    },
    {
      name: 'integration-tests',
      testMatch: '**/*.integration.test.ts',
      use: {
        baseURL: 'http://localhost:3000' // Start with web, test across all apps
      }
    }
  ]
});
```

### Environment-Specific Testing
```typescript
// Test against different environments
const environments = {
  development: {
    webApp: 'http://localhost:3000',
    apiApp: 'http://localhost:3001', 
    paymentsApp: 'http://localhost:3002'
  },
  staging: {
    webApp: 'https://web-staging.vercel.app',
    apiApp: 'https://api-staging.vercel.app',
    paymentsApp: 'https://payments-staging.vercel.app'
  },
  production: {
    webApp: 'https://odyssey.com',
    apiApp: 'https://api.odyssey.com',
    paymentsApp: 'https://payments.odyssey.com'
  }
};
```

## Benefits of Runners Pattern

### 🔧 **Maintainability**
- Each endpoint has dedicated test logic
- Easy to update when APIs change
- Clear ownership and responsibility

### 🚀 **Scalability** 
- Add new runners for new endpoints
- Compose complex flows from simple runners
- Parallel test execution

### 🧪 **Reusability**
- Share runners across different test scenarios
- Compose operations from existing runners
- Consistent testing patterns

### 📊 **Debugging**
- Clear test failure attribution
- Isolated test scenarios
- Comprehensive logging and tracing

### 🤖 **AI-Friendly**
- Clear file structure for AI tools
- Predictable naming conventions  
- Isolated concerns for focused AI assistance

## Migration Strategy

### Phase 1: Current State (Backend Only)
- ✅ API endpoint runners established
- ✅ Basic operations for user flows
- ✅ Health check and auth testing

### Phase 2: Apps Architecture (MVP)
- 🔄 Add minimal frontend page runners
- 🔄 Add basic payments app runners
- 🔄 Create cross-app integration operations

### Phase 3: Full Platform (Scale)
- 📈 Comprehensive frontend testing
- 📈 Advanced payment scenarios
- 📈 Complete user journey testing
- 📈 Performance and load testing
