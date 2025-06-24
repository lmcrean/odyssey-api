# Integration Testing Architecture - Vitest Within Apps

> **Integration Testing Strategy**: Test multiple components working together within the same app domain

## Overview
Integration tests verify that multiple units (controllers, services, models) work correctly together within a single app domain. Unlike E2E tests that test across apps with real browsers, integration tests focus on **within-app component interaction** using Vitest.

## Integration vs E2E Distinction

### 🔧 **Integration Tests (Vitest) - Within App**
```typescript
// Location: apps/{domain}/__tests__/
// Purpose: Test multiple components within same app working together
// Tool: Vitest (fast, no browser)
// Scope: Single app domain

apps/auth/__tests__/auth-flow.integration.test.ts
// Tests: LoginController + ValidationService + AuthService + Database
// Mocks: External APIs, real browser interactions
```

### 🎭 **E2E Tests (Playwright) - Cross App**  
```typescript
// Location: e2e/runners/
// Purpose: Test complete user journeys across multiple apps
// Tool: Playwright (real browser)
// Scope: Cross-app workflows

e2e/master-integration.spec.ts → operations/creatorJourney.ts → runners/
// Tests: Full user flow across web + api + payments apps
// Real: Browser interactions, actual API calls
```

## Integration Test Structure

### **Apps-Based Organization**
```typescript
odyssey/
├── apps/
│   ├── auth/
│   │   ├── __tests__/
│   │   │   ├── auth-flow.integration.test.ts     # Login + Register + Logout flow
│   │   │   ├── validation.integration.test.ts    # ValidationService + AuthService
│   │   │   ├── LoginController.test.ts           # Unit test (single controller)
│   │   │   └── ValidationService.test.ts         # Unit test (single service)
│   │   ├── routes/login/Controller.ts
│   │   ├── routes/register/Controller.ts
│   │   └── services/AuthService.ts
│   ├── user/
│   │   ├── __tests__/
│   │   │   ├── profile-management.integration.test.ts  # Get + Update + Delete profile
│   │   │   ├── user-search.integration.test.ts         # Search + Filter + Pagination
│   │   │   └── unified-model.integration.test.ts       # Database operations together
│   │   ├── routes/getUserProfile/Controller.ts
│   │   ├── routes/updateProfile/Controller.ts
│   │   └── models/database/
│   ├── payments/
│   │   ├── __tests__/
│   │   │   ├── stripe-integration.integration.test.ts  # Payment + Webhook + Validation
│   │   │   ├── payment-flow.integration.test.ts        # Create + Process + Confirm
│   │   │   └── webhook-processing.integration.test.ts  # Webhook + Database updates
│   │   ├── routes/create/Controller.ts
│   │   ├── routes/process/Controller.ts
│   │   └── services/StripeService.ts
│   └── content/
│       ├── __tests__/
│       │   ├── image-lifecycle.integration.test.ts     # Upload + Process + Store + Retrieve
│       │   ├── content-management.integration.test.ts  # Create + Update + Delete + List
│       │   └── media-processing.integration.test.ts    # Upload + Validation + Storage
│       ├── routes/upload/Controller.ts
│       ├── routes/delete/Controller.ts
│       └── services/MediaService.ts
```

## Integration Test Patterns

### 1. **Multi-Controller Flow Testing**
```typescript
// apps/auth/__tests__/auth-flow.integration.test.ts
describe('Authentication Flow Integration', () => {
  test('complete user registration and login flow', async () => {
    // Test RegisterController + LoginController + ValidationService working together
    const registerResult = await registerController.handle(registerRequest);
    expect(registerResult.success).toBe(true);
    
    const loginResult = await loginController.handle(loginRequest);
    expect(loginResult.token).toBeDefined();
    expect(loginResult.user.id).toBe(registerResult.user.id);
  });
});
```

### 2. **Service + Database Integration**
```typescript
// apps/user/__tests__/unified-model.integration.test.ts  
describe('User Model Integration', () => {
  test('user creation with profile setup', async () => {
    // Test createUser + updateProfile + findUserById working together
    const user = await createUser(userData);
    const profile = await updateProfile(user.id, profileData);
    const retrieved = await findUserById(user.id);
    
    expect(retrieved.profile).toEqual(profile);
  });
});
```

### 3. **External Service Integration**
```typescript
// apps/payments/__tests__/stripe-integration.integration.test.ts
describe('Stripe Payment Integration', () => {
  test('payment creation and webhook processing', async () => {
    // Test PaymentController + StripeService + WebhookHandler working together
    const payment = await paymentController.create(paymentData);
    const webhook = await webhookHandler.process(stripeWebhookData);
    const updated = await getPaymentStatus(payment.id);
    
    expect(updated.status).toBe('completed');
  });
});
```

## Testing Commands

### **Domain-Specific Integration Testing**
```bash
# Test all integration tests in auth app
npm run test "apps/auth" --testNamePattern="integration"

# Test specific integration flow
npm run test "auth-flow.integration.test.ts"

# Test all integration tests across all apps  
npm run test --testNamePattern="integration"

# Test specific app's integration tests
npm run test "apps/user" --testNamePattern="integration"
```

### **Integration vs Unit Test Separation**
```bash
# Run only integration tests
npm run test --testNamePattern="integration"

# Run only unit tests (exclude integration)
npm run test --testNamePattern="^(?!.*integration).*test"

# Run all tests in specific app
npm run test "apps/auth"
```

## Key Benefits

### 🚀 **Within-App Component Verification**
- **Multi-component flows**: Controllers + Services + Models working together
- **Database integration**: Real database operations with test data
- **Service layer testing**: Business logic with dependencies
- **Error handling**: How components handle failures together

### ⚡ **Fast Execution**
- **No browser overhead**: Vitest runs in Node.js
- **Mocked externals**: Mock external APIs, real internal components
- **Parallel execution**: Multiple integration tests run simultaneously
- **Quick feedback**: Faster than E2E, more comprehensive than unit tests

### 🔧 **Development Workflow**
```typescript
// TDD Workflow with Integration Tests
1. Write failing integration test (Red)
2. Implement controllers/services to pass (Green)  
3. Refactor while keeping tests green (Refactor)
4. Run E2E tests to verify cross-app flows
```

## Integration Test Scope

### ✅ **What Integration Tests Cover**
- Multiple controllers working in sequence
- Service layer + database operations
- Data transformation across components
- Error handling between components
- Business logic workflows within app

### ❌ **What Integration Tests Don't Cover**
- Cross-app communication (E2E handles this)
- Real browser interactions (E2E handles this)
- External API calls (mocked in integration tests)
- Complete user journeys (E2E handles this)

## Relationship to E2E Testing

```typescript
// Development Flow:
Unit Tests → Integration Tests → E2E Tests

// Example: User Registration
1. Unit: ValidationService.test.ts (email validation)
2. Integration: auth-flow.integration.test.ts (register + login flow)  
3. E2E: operations/creatorJourney.ts (register → upload → payment)
```

Integration tests provide the **middle layer** - more comprehensive than unit tests, faster than E2E tests, focused on **within-app component collaboration**.
