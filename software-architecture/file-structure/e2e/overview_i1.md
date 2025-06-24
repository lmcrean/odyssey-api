# E2E Testing Architecture - API-First Playwright Runners Pattern

> **Testing Strategy**: API-first approach with separate .api.ts and .web.ts runners for comprehensive coverage

## Overview
Comprehensive end-to-end testing using Playwright with an **API-first runners pattern** that provides modular, reusable, and maintainable test components. Each endpoint gets both API and Web runner classes, with master-integration executing API tests first, then Web tests.

## API-First Testing Philosophy
```typescript
// Master Integration Flow:
1. API Tests   → Validate all backend endpoints work correctly
2. Web Tests   → Validate frontend integrations with working APIs
3. Cross-App   → Validate complete user journeys across all apps
```

## Current Structure (All Apps Coverage)
```typescript
odyssey/e2e/
├── master-integration.spec.ts    # API-first test orchestration
├── playwright.config.ts          # Playwright configuration
└── runners/
    ├── auth/                     # Authentication app runners
    │   ├── login.api.ts          # POST /api/auth/login (API validation)
    │   ├── login.web.ts          # /login page (UI interaction)
    │   ├── register.api.ts       # POST /api/auth/register (API validation)
    │   ├── register.web.ts       # /register page (UI interaction)
    │   ├── logout.api.ts         # POST /api/auth/logout (API validation)
    │   ├── logout.web.ts         # Logout UI flow (UI interaction)
    │   ├── refresh-token.api.ts  # POST /api/auth/refresh (API validation)
    │   └── refresh-token.web.ts  # Token refresh UI handling
    ├── user/                     # User management runners
    │   ├── get-user-profile.api.ts      # GET /api/users/profile (API)
    │   ├── get-user-profile.web.ts      # /profile page (UI)
    │   ├── update-profile.api.ts        # PUT /api/users/profile (API)
    │   ├── update-profile.web.ts        # /profile/edit page (UI)
    │   ├── search-users.api.ts          # GET /api/users/search (API)
    │   ├── search-users.web.ts          # /users/search page (UI)
    │   ├── check-username.api.ts        # GET /api/users/check-username (API)
    │   ├── check-username.web.ts        # Username validation UI
    │   ├── get-public-profile.api.ts    # GET /api/users/:id/public (API)
    │   └── get-public-profile.web.ts    # /users/:id page (UI)
    ├── content/                  # Content management runners (MVP)
    │   ├── upload-image.api.ts   # POST /api/content/upload (API)
    │   ├── upload-image.web.ts   # /upload page (UI)
    │   ├── delete-content.api.ts # DELETE /api/content/:id (API)
    │   ├── delete-content.web.ts # Delete content UI flow
    │   ├── view-content.api.ts   # GET /api/content/:id (API)
    │   └── view-content.web.ts   # /content/:id page (UI)
    ├── payments/                 # Payment processing runners (MVP)
    │   ├── create-payment.api.ts # POST /api/payments/create (API)
    │   ├── create-payment.web.ts # /payments/create page (UI)
    │   ├── process-payment.api.ts # POST /api/payments/process (API)
    │   ├── process-payment.web.ts # Payment processing UI
    │   ├── confirm-payment.api.ts # POST /api/payments/confirm (API)
    │   ├── confirm-payment.web.ts # Payment confirmation UI
    │   ├── stripe-webhook.api.ts  # Stripe webhook handling (API)
    │   └── payment-history.web.ts # /payments/history page (UI)
    ├── chat/                     # Chat runners (MVP)
    │   ├── send-message.api.ts   # POST /api/chat/send-message (API)
    │   ├── send-message.web.ts   # Chat message UI flow
    │   ├── get-messages.api.ts   # GET /api/chat/get-messages (API)
    │   ├── get-messages.web.ts   # /chat/:id page (UI)
    │   ├── get-conversation-list.api.ts # GET /api/chat/conversations (API)
    │   └── get-conversation-list.web.ts # /chat page (UI)
    ├── ai/                       # AI app runners (Future)
    │   ├── chat-completion.api.ts # POST /api/ai/chat (API)
    │   ├── chat-completion.web.ts # /ai/chat page (UI)
    │   ├── content-generation.api.ts # POST /api/ai/generate (API)
    │   └── content-generation.web.ts # /ai/generate page (UI)
    ├── workers/                  # Background workers runners (Future)
    │   ├── process-media.api.ts  # Media processing jobs (API)
    │   ├── send-notifications.api.ts # Notification jobs (API)
    │   └── analytics-jobs.api.ts # Analytics processing (API)
    ├── health/                   # Health check runners
    │   ├── health-status.api.ts  # GET /api/health (API)
    │   ├── health-status.web.ts  # /health page (UI)
    │   ├── database-health.api.ts # GET /api/health/db (API)
    │   ├── database-health.web.ts # /health/database page (UI)
    │   └── cors-check.api.ts     # OPTIONS preflight testing (API)
    └── operations/               # Orchestrated test flows
        ├── api-first/
        │   ├── auth-flow.ts      # API → Web auth journey
        │   ├── user-flow.ts      # API → Web user management
        │   ├── content-flow.ts   # API → Web content lifecycle
        │   ├── payment-flow.ts   # API → Web payment processing
        │   └── chat-flow.ts      # API → Web messaging
        └── cross-app/
            ├── creator-journey.ts    # Complete creator workflow
            ├── fan-experience.ts     # Complete fan workflow
            └── platform-admin.ts    # Admin management workflow
```

## API-First Testing Architecture Flow

### 🎭 **Master Integration - API First**
```typescript
// master-integration.spec.ts - API-first orchestration
test.describe('API-First Platform Testing', () => {
  test.describe('Phase 1: API Endpoint Validation', () => {
    test('auth api endpoints', async ({ request }) => {
      const authFlow = new AuthApiFlow(request);
      await authFlow.executeAllEndpoints();
    });

    test('user api endpoints', async ({ request }) => {
      const userFlow = new UserApiFlow(request);
      await userFlow.executeAllEndpoints();
    });

    test('content api endpoints', async ({ request }) => {
      const contentFlow = new ContentApiFlow(request);
      await contentFlow.executeAllEndpoints();
    });

    test('payments api endpoints', async ({ request }) => {
      const paymentsFlow = new PaymentsApiFlow(request);
      await paymentsFlow.executeAllEndpoints();
    });

    test('chat api endpoints', async ({ request }) => {
      const chatFlow = new ChatApiFlow(request);
      await chatFlow.executeAllEndpoints();
    });
  });

  test.describe('Phase 2: Web UI Integration', () => {
    test('auth web interfaces', async ({ page }) => {
      const authWebFlow = new AuthWebFlow(page);
      await authWebFlow.executeAllPages();
    });

    test('user web interfaces', async ({ page }) => {
      const userWebFlow = new UserWebFlow(page);
      await userWebFlow.executeAllPages();
    });

    test('content web interfaces', async ({ page }) => {
      const contentWebFlow = new ContentWebFlow(page);
      await contentWebFlow.executeAllPages();
    });

    test('payments web interfaces', async ({ page }) => {
      const paymentsWebFlow = new PaymentsWebFlow(page);
      await paymentsWebFlow.executeAllPages();
    });

    test('chat web interfaces', async ({ page }) => {
      const chatWebFlow = new ChatWebFlow(page);
      await chatWebFlow.executeAllPages();
    });
  });

  test.describe('Phase 3: Cross-App User Journeys', () => {
    test('complete creator journey', async ({ page, request }) => {
      const creatorJourney = new CreatorJourneyOperation(page, request);
      await creatorJourney.execute();
    });

    test('complete fan experience', async ({ page, request }) => {
      const fanExperience = new FanExperienceOperation(page, request);
      await fanExperience.execute();
    });
  });
});
```

### 🔧 **API Operations Orchestrate API Runners**
```typescript
// operations/api-first/auth-flow.ts
export class AuthApiFlow {
  constructor(private request: APIRequestContext) {}

  async executeAllEndpoints() {
    // Test all auth API endpoints in logical sequence
    const register = new RegisterApiRunner(this.request);
    const login = new LoginApiRunner(this.request);
    const refreshToken = new RefreshTokenApiRunner(this.request);
    const logout = new LogoutApiRunner(this.request);
    
    // Execute API tests first - validate backend works
    const user = await register.runValidRegistration();
    const tokens = await login.runValidLogin(user.email, user.password);
    const newTokens = await refreshToken.runTokenRefresh(tokens.refreshToken);
    await logout.runValidLogout(newTokens.accessToken);
    
    return { success: true, apiValidation: 'complete' };
  }
}
```

### 🎨 **Web Operations Orchestrate Web Runners**
```typescript
// operations/api-first/auth-flow.ts (extended)
export class AuthWebFlow {
  constructor(private page: Page) {}

  async executeAllPages() {
    // Test all auth web interfaces - assumes APIs work from Phase 1
    const registerWeb = new RegisterWebRunner(this.page);
    const loginWeb = new LoginWebRunner(this.page);
    const logoutWeb = new LogoutWebRunner(this.page);
    
    // Execute web tests - validate frontend integrations
    await registerWeb.runUserRegistrationFlow();
    await loginWeb.runUserLoginFlow();
    await logoutWeb.runUserLogoutFlow();
    
    return { success: true, webValidation: 'complete' };
  }
}
```

### ⚡ **API Runners Execute Single API Actions**
```typescript
// runners/auth/login.api.ts - API validation only
export class LoginApiRunner {
  constructor(private request: APIRequestContext) {}
  
  async runValidLogin(email: string, password: string) {
    const response = await this.request.post('/api/auth/login', {
      data: { email, password }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('accessToken');
    expect(data).toHaveProperty('refreshToken');
    
    return { 
      success: true, 
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user 
    };
  }

  async runInvalidLogin() {
    const response = await this.request.post('/api/auth/login', {
      data: { email: 'invalid@example.com', password: 'wrongpassword' }
    });
    
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    
    return { success: false, error: data.error };
  }
}
```

### 🎨 **Web Runners Execute Single UI Actions**
```typescript
// runners/auth/login.web.ts - UI interaction only
export class LoginWebRunner {
  constructor(private page: Page) {}
  
  async runUserLoginFlow() {
    // Navigate to login page
    await this.page.goto('/login');
    await expect(this.page).toHaveTitle(/Login/);
    
    // Fill and submit login form
    await this.page.fill('[data-testid="email"]', 'test@example.com');
    await this.page.fill('[data-testid="password"]', 'TestPassword123!');
    await this.page.click('[data-testid="login-button"]');
    
    // Verify successful login redirect
    await expect(this.page).toHaveURL('/dashboard');
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    return { success: true, redirectedTo: '/dashboard' };
  }

  async runLoginValidationErrors() {
    await this.page.goto('/login');
    
    // Test empty form submission
    await this.page.click('[data-testid="login-button"]');
    await expect(this.page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="password-error"]')).toBeVisible();
    
    // Test invalid email format
    await this.page.fill('[data-testid="email"]', 'invalid-email');
    await this.page.click('[data-testid="login-button"]');
    await expect(this.page.locator('[data-testid="email-error"]')).toContainText('valid email');
    
    return { success: true, validationTested: true };
  }
}
```

## Runner Pattern Principles - API-First

### 1. **API-First File Naming Convention**
```typescript
// API runners test backend endpoints
login.api.ts              # Tests POST /api/auth/login endpoint
register.api.ts           # Tests POST /api/auth/register endpoint  
update-profile.api.ts     # Tests PUT /api/users/profile endpoint
upload-image.api.ts       # Tests POST /api/content/upload endpoint

// Web runners test frontend pages
login.web.ts              # Tests /login page UI interactions
register.web.ts           # Tests /register page UI interactions
update-profile.web.ts     # Tests /profile/edit page UI interactions
upload-image.web.ts       # Tests /upload page UI interactions

// No .test suffix - they're action runners, not test files!
```

### 2. **App-Based Folder Organization**
```typescript
// All related tests in same app folder
runners/
├── auth/              # Authentication app
│   ├── login.api.ts       # API endpoint testing
│   ├── login.web.ts       # Web page testing
│   ├── register.api.ts
│   └── register.web.ts
├── user/              # User management app
│   ├── get-profile.api.ts
│   ├── get-profile.web.ts
│   ├── update-profile.api.ts
│   └── update-profile.web.ts
├── content/           # Content management app
│   ├── upload-image.api.ts
│   ├── upload-image.web.ts
│   ├── delete-content.api.ts
│   └── delete-content.web.ts
├── payments/          # Payment processing app
│   ├── create-payment.api.ts
│   ├── create-payment.web.ts
│   ├── process-payment.api.ts
│   └── process-payment.web.ts
└── chat/              # Chat app
    ├── send-message.api.ts
    ├── send-message.web.ts
    ├── get-messages.api.ts
    └── get-messages.web.ts
```

### 3. **Reusable & Composable Runners**
```typescript
// API runners focus on endpoint validation
export class CreatePaymentApiRunner {
  constructor(private request: APIRequestContext) {}

  async runValidPayment(paymentData: PaymentData) {
    const response = await this.request.post('/api/payments/create', {
      data: paymentData,
      headers: { 'Authorization': `Bearer ${paymentData.accessToken}` }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('paymentId');
    return { success: true, paymentId: data.paymentId };
  }
}

// Web runners focus on UI validation
export class CreatePaymentWebRunner {
  constructor(private page: Page) {}

  async runPaymentCreationFlow(paymentData: PaymentData) {
    await this.page.goto('/payments/create');
    
    // Fill payment form
    await this.page.fill('[data-testid="amount"]', paymentData.amount.toString());
    await this.page.selectOption('[data-testid="currency"]', paymentData.currency);
    await this.page.fill('[data-testid="description"]', paymentData.description);
    
    // Submit and verify
    await this.page.click('[data-testid="create-payment"]');
    await expect(this.page).toHaveURL(/\/payments\/\d+/);
    await expect(this.page.locator('[data-testid="payment-created"]')).toBeVisible();
    
    return { success: true, pageRedirected: true };
  }
}
```

## Configuration & Environment - All Apps

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // API-first requires sequential execution
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
      testMatch: '**/*.api.ts',
      use: { 
        baseURL: process.env.API_BASE_URL || 'https://odyssey-api-lmcreans-projects.vercel.app'
      }
    },
    {
      name: 'web-tests', 
      testMatch: '**/*.web.ts',
      dependencies: ['api-tests'], // Run after API tests pass
      use: { 
        baseURL: process.env.WEB_BASE_URL || 'https://odyssey-web-lmcreans-projects.vercel.app',
        browserName: 'webkit' // Safari only
      }
    },
    {
      name: 'integration-tests',
      testMatch: '**/master-integration.spec.ts',
      dependencies: ['api-tests', 'web-tests'],
      use: {
        baseURL: process.env.WEB_BASE_URL || 'https://odyssey-web-lmcreans-projects.vercel.app'
      }
    }
  ]
});
```

### Environment-Specific Testing - All Apps
```typescript
// Test against different environments
const environments = {
  development: {
    webApp: 'http://localhost:3000',
    apiApp: 'http://localhost:3001', 
    paymentsApp: 'http://localhost:3002',
    aiApp: 'http://localhost:3003',
    workersApp: 'http://localhost:3004'
  },
  staging: {
    webApp: 'https://odyssey-web-staging-lmcreans-projects.vercel.app',
    apiApp: 'https://odyssey-api-staging-lmcreans-projects.vercel.app',
    paymentsApp: 'https://odyssey-payments-staging-lmcreans-projects.vercel.app',
    aiApp: 'https://odyssey-ai-staging-lmcreans-projects.vercel.app',
    workersApp: 'https://odyssey-workers-staging-lmcreans-projects.vercel.app'
  },
  production: {
    webApp: 'https://odyssey-web-lmcreans-projects.vercel.app',
    apiApp: 'https://odyssey-api-lmcreans-projects.vercel.app',
    paymentsApp: 'https://odyssey-payments-lmcreans-projects.vercel.app',
    aiApp: 'https://odyssey-ai-lmcreans-projects.vercel.app',
    workersApp: 'https://odyssey-workers-lmcreans-projects.vercel.app'
  }
};
```

## Benefits of API-First Runners Pattern

### 🔧 **API-First Confidence**
- Validate all backend endpoints work before testing UI
- Faster feedback on API failures vs UI integration issues
- Clear separation of backend vs frontend failures
- Reliable foundation for web testing

### 🚀 **Complete App Coverage** 
- Every app gets both API and Web testing
- Future-ready structure for AI and Workers apps
- Consistent pattern across all applications
- Scalable to new apps without restructuring

### 🧪 **Clear Testing Phases**
- Phase 1: API endpoint validation (fast, reliable)
- Phase 2: Web UI integration (assumes APIs work)
- Phase 3: Cross-app user journeys (complete workflows)
- Logical progression from simple to complex

### 📊 **Superior Debugging**
- API failures identified immediately in Phase 1
- Web failures clearly attributed to frontend in Phase 2
- Cross-app failures isolated to integration issues in Phase 3
- Clear test failure attribution and faster resolution

### 🤖 **AI-Friendly & Future-Ready**
- Predictable file naming for all apps (.api.ts + .web.ts)
- Clear separation of concerns for AI tools
- Ready for AI and Workers apps without refactoring
- Consistent patterns across entire platform

## Migration Strategy - All Apps

### Phase 1: Current State (API App Focus)
- ✅ API endpoint runners for auth, user, health
- ✅ Basic web runners for critical paths
- ✅ API-first testing established

### Phase 2: MVP Apps (Content, Payments, Chat)
- 🔄 Add content.api.ts + content.web.ts runners
- 🔄 Add payments.api.ts + payments.web.ts runners  
- 🔄 Add chat.api.ts + chat.web.ts runners
- 🔄 Implement API-first operations for each app

### Phase 3: Full Platform (AI, Workers)
- 📈 Add ai.api.ts + ai.web.ts runners
- 📈 Add workers.api.ts runners (background jobs)
- 📈 Complete cross-app integration operations
- 📈 Advanced performance and load testing

### Phase 4: Scale Operations
- 📈 Advanced user journey operations
- 📈 Multi-tenant testing scenarios
- 📈 Performance benchmarking across all apps
- 📈 Automated regression testing pipeline
