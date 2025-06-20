# E2E Testing Architecture - Playwright Runners Pattern

> **Testing Strategy**: Each endpoint = unique runner file, organized by app type (API/Web)

## Overview
Comprehensive end-to-end testing using Playwright with a **runners pattern** that provides modular, reusable, and maintainable test components. Each API endpoint and web interaction gets its own runner class, organized by domain and app type.

## Apps/Packages Architecture Structure
```typescript
odyssey/e2e/
├── master-integration.spec.ts    # Single test file that runs everything
├── playwright.config.ts          # Global Playwright config
└── runners/
    ├── auth/                     # Authentication domain
    │   ├── login/
    │   │   ├── login.api.ts      # Backend API endpoint testing
    │   │   └── login.web.ts      # Frontend UI testing
    │   ├── register/
    │   │   ├── register.api.ts   
    │   │   └── register.web.ts   
    │   └── logout/
    │       ├── logout.api.ts     
    │       └── logout.web.ts     
    ├── user/                     # User management domain
    │   ├── profile/
    │   │   ├── getProfile.api.ts
    │   │   ├── updateProfile.api.ts
    │   │   └── profile.web.ts    # UI for viewing/editing profile
    │   ├── search/
    │   │   ├── searchUsers.api.ts
    │   │   └── search.web.ts
    │   └── username/
    │       ├── checkUsername.api.ts
    │       └── username.web.ts
    ├── content/                  # Content management domain (future)
    │   ├── upload/
    │   │   ├── uploadImage.api.ts
    │   │   └── upload.web.ts
    │   └── manage/
    │       ├── deleteContent.api.ts
    │       └── manage.web.ts
    ├── payments/                 # Payment processing domain (future)
    │   ├── create/
    │   │   ├── createPayment.api.ts
    │   │   └── create.web.ts
    │   └── process/
    │       ├── processPayment.api.ts
    │       └── process.web.ts
    └── operations/              # Cross-domain orchestration
        ├── auth/
        │   ├── authFlow.api.ts   # Backend-only auth operations
        │   └── authFlow.web.ts   # Frontend-only auth operations
        ├── user/
        │   ├── userFlow.api.ts   # Backend user operations
        │   └── userFlow.web.ts   # Frontend user operations
        └── content/              # Future content flows
            ├── contentFlow.api.ts
            └── contentFlow.web.ts
```

## Testing Architecture Flow

### 🎭 **Single Test Entry Point**
```typescript
// master-integration.spec.ts - The ONLY .spec file
test('API auth flow', async ({ request }) => {
  const authFlow = new AuthFlowApiOperation(request);
  await authFlow.runComplete();
});

test('Web auth flow', async ({ page }) => {
  const authFlow = new AuthFlowWebOperation(page);  
  await authFlow.runComplete();
});

test('API user management', async ({ request }) => {
  const userFlow = new UserFlowApiOperation(request);
  await userFlow.runComplete();
});

test('Web user journey', async ({ page }) => {
  const userFlow = new UserFlowWebOperation(page);
  await userFlow.runComplete();
});
```

### 🔧 **Operations Orchestrate App-Specific Runners**
```typescript
// operations/auth/authFlow.api.ts - Backend API operations
export class AuthFlowApiOperation {
  constructor(private request: APIRequestContext) {}
  
  async runComplete() {
    const register = new RegisterApiRunner(this.request);
    const login = new LoginApiRunner(this.request);
    const logout = new LogoutApiRunner(this.request);
    
    await register.runValidRegistration();
    await login.runValidLogin();
    await logout.runLogout();
  }
}

// operations/auth/authFlow.web.ts - Frontend UI operations  
export class AuthFlowWebOperation {
  constructor(private page: Page) {}
  
  async runComplete() {
    const register = new RegisterWebRunner(this.page);
    const login = new LoginWebRunner(this.page);
    const logout = new LogoutWebRunner(this.page);
    
    await register.runValidRegistration();
    await login.runValidLogin();
    await logout.runLogout();
  }
}
```

### ⚡ **App-Specific Runners Execute Single Actions**

#### **API Runner Pattern**
```typescript
// runners/auth/login/login.api.ts - Backend endpoint testing
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
```

#### **Web Runner Pattern**
```typescript
// runners/auth/login/login.web.ts - Frontend UI testing
export class LoginWebRunner {
  constructor(private page: Page) {}
  
  async runValidLogin() {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="email"]', 'test@example.com');
    await this.page.fill('[data-testid="password"]', 'TestPassword123!');
    await this.page.click('[data-testid="login-button"]');
    
    await expect(this.page).toHaveURL('/dashboard');
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    return { success: true };
  }
}
```

## Runner Pattern Principles

### 1. **App-Specific File Naming**
```typescript
// Naming convention: {action}.{app}.ts
login.api.ts          # Backend API endpoint testing
login.web.ts          # Frontend UI interaction testing
register.api.ts       # Backend registration endpoint  
register.web.ts       # Frontend registration form

// Clear separation of concerns:
// .api.ts = APIRequestContext, HTTP requests, JSON validation
// .web.ts = Page interactions, selectors, UI validation
```

### 2. **Domain-First Organization**
```typescript
// Related functionality grouped by domain, then by app
runners/
├── auth/              # Authentication domain
│   ├── login/         # Login functionality
│   │   ├── login.api.ts
│   │   └── login.web.ts
│   └── register/      # Registration functionality
│       ├── register.api.ts
│       └── register.web.ts
├── user/              # User management domain
│   ├── profile/       # Profile functionality
│   │   ├── getProfile.api.ts
│   │   ├── updateProfile.api.ts
│   │   └── profile.web.ts
│   └── search/        # Search functionality
│       ├── searchUsers.api.ts
│       └── search.web.ts
```

### 3. **Separate Testing Buckets**
```typescript
// Clean workflow: Test apps separately, not mixed
Bucket 1: All API Testing    (Fast, no browser overhead)
Bucket 2: All Web Testing    (Browser-based, UI validation)

// No .integrated.ts files - keeps it simple
// Cross-app testing handled at operation level if needed
```

## Testing Commands & Workflow

### **Separate App Testing**
```bash
# Test all API endpoints (fast, no browser)
npx playwright test --project=api-tests

# Test all web interactions (browser-based)  
npx playwright test --project=web-tests

# Test both buckets sequentially
npm run test:api && npm run test:web

# Test specific domain API
npx playwright test --project=api-tests --grep="auth"

# Test specific domain web
npx playwright test --project=web-tests --grep="user"
```

### **Package.json Scripts**
```json
{
  "scripts": {
    "test:api": "playwright test --project=api-tests",
    "test:web": "playwright test --project=web-tests", 
    "test:e2e": "npm run test:api && npm run test:web",
    "test:auth:api": "playwright test --project=api-tests --grep='auth'",
    "test:auth:web": "playwright test --project=web-tests --grep='auth'"
  }
}
```

## Playwright Configuration

### **App-Specific Project Configuration**
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.api.spec.ts',
      use: { 
        baseURL: 'https://odyssey-api-lmcreans-projects.vercel.app'
      }
    },
    {
      name: 'web-tests',
      testMatch: '**/*.web.spec.ts',
      use: { 
        baseURL: 'https://odyssey-web-lmcreans-projects.vercel.app',
        browserName: 'webkit' // Safari only per project requirements
      }
    }
  ]
});
```

### **Environment-Specific Testing**
```typescript
// Test against different deployment environments
const environments = {
  development: {
    api: 'http://localhost:3001',
    web: 'http://localhost:3000'
  },
  staging: {
    api: 'https://odyssey-api-staging-lmcreans-projects.vercel.app',
    web: 'https://odyssey-web-staging-lmcreans-projects.vercel.app'
  },
  production: {
    api: 'https://odyssey-api-lmcreans-projects.vercel.app',
    web: 'https://odyssey-web-lmcreans-projects.vercel.app'
  }
};
```

## Benefits of App-Specific Runners Pattern

### 🚀 **Clear Separation of Concerns**
- **API testing**: Request/response validation, data integrity, business logic
- **Web testing**: UI interactions, user experience, visual feedback  
- **No mixed concerns**: Each file has single responsibility

### ⚡ **Optimized Testing Speed**
- **API tests**: Fast execution, no browser overhead
- **Web tests**: Full browser testing when needed
- **Parallel execution**: Both test types can run simultaneously

### 🔧 **Maintainability**
- **Co-location**: API and web versions of same feature are adjacent
- **Easy updates**: When feature changes, both files are in same folder
- **Clear ownership**: Each runner has single responsibility

### 📊 **Development Workflow**
- **Separate buckets**: Test API independently of web, or together
- **Targeted testing**: Test specific domains or specific app types
- **CI/CD friendly**: Different pipelines for different app types

### 🤖 **AI-Friendly Architecture**
- **Predictable patterns**: Clear naming conventions for AI tools
- **Domain boundaries**: Easy for AI to understand feature organization
- **Isolated concerns**: AI can focus on single app type per file

## Migration Strategy

### Phase 1: Current State → App-Specific Structure
- ✅ Convert existing API runners to `.api.ts` pattern
- 🔄 Create corresponding `.web.ts` runners for UI testing
- 🔄 Reorganize operations by app type

### Phase 2: Complete Two-App Testing
- 📈 Full coverage of API endpoints
- 📈 Complete web UI testing coverage
- 📈 Optimized testing workflows

### Phase 3: Scale to Additional Apps (Future)
- 📈 Add payments app runners (payments.api.ts, payments.web.ts)
- 📈 Add workers app testing
- 📈 Cross-app user journey testing

## Integration with Other Testing Layers

### **Testing Pyramid Integration**
```typescript
Unit Tests (Vitest)     → Integration Tests (Vitest)    → E2E Tests (Playwright)
├── Single functions    ├── Multiple components        ├── Complete user flows
├── Fast feedback       ├── Within-app testing         ├── Cross-app validation  
└── Isolated testing    └── Database + services        └── Real browser testing

// E2E complements, doesn't replace other testing layers
```

### **Relationship to Integration Testing**
- **Integration tests**: Multiple components within same app (Vitest)
- **E2E tests**: Complete flows across apps (Playwright)
- **Complementary**: Both needed for comprehensive testing strategy
