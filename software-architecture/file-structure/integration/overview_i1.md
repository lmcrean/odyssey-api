# Integration Testing Architecture - MVP Essential Integration Tests

> **Integration Testing Strategy**: Test multiple components working together within the same domain using root-level integration directory

## Overview
Integration tests verify that multiple units (controllers, services, models) work correctly together within a single domain. Unlike E2E tests that test across apps with real browsers, integration tests focus on **within-domain component interaction** using Vitest.

## Integration vs E2E Distinction

### 🔧 **Integration Tests (Vitest) - Within Domain**
```typescript
// Location: integration/{domain}/
// Purpose: Test multiple components within same domain working together
// Tool: Vitest (fast, no browser)
// Scope: Single domain

integration/auth/auth-flow.integration.test.ts
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

## Integration Test Structure - MVP Essential

### **Root-Level Integration Directory**
```typescript
odyssey/
├── apps/
├── integration/                                 # Root-level integration tests
│   ├── auth/
│   │   ├── auth-flow.integration.test.ts        # Register → Login → Logout
│   │   ├── token-management.integration.test.ts # Token refresh cycle
│   │   └── validation-chain.integration.test.ts # Email + password validation
│   ├── user/
│   │   ├── profile-lifecycle.integration.test.ts # Create → Update → Get profile
│   │   ├── username-validation.integration.test.ts # Check + validate username
│   │   └── search-users.integration.test.ts     # Search + filter users
│   ├── content/
│   │   ├── media-upload.integration.test.ts     # Basic upload + storage
│   │   ├── image-processing.integration.test.ts # Basic image processing
│   │   └── content-access.integration.test.ts   # View + download content
│   ├── chat/
│   │   ├── message-flow.integration.test.ts     # Send + receive messages
│   │   ├── conversation-basic.integration.test.ts # Create + list conversations
│   │   └── message-validation.integration.test.ts # Message content validation
│   ├── payments/
│   │   ├── payment-basic.integration.test.ts    # Create + process payments
│   │   ├── stripe-webhook.integration.test.ts   # Basic webhook handling
│   │   └── payment-validation.integration.test.ts # Amount + user validation
│   ├── health/
│   │   ├── system-health.integration.test.ts    # Health + DB connectivity
│   │   └── cors-validation.integration.test.ts  # CORS + preflight handling
│   └── shared/
│       ├── database-operations.integration.test.ts # Core DB operations
│       └── middleware-auth.integration.test.ts     # Auth middleware chain
└── e2e/                                         # Cross-app E2E tests
    ├── master-integration.spec.ts
    └── runners/
```

## Essential MVP Integration Test Patterns

### 1. **Authentication Flow Integration**
```typescript
// integration/auth/auth-flow.integration.test.ts
describe('Authentication Flow Integration', () => {
  test('complete user registration and login flow', async () => {
    // Test RegisterController + LoginController + ValidationService working together
    const registerResult = await registerController.handle(registerRequest);
    expect(registerResult.success).toBe(true);
    
    const loginResult = await loginController.handle(loginRequest);
    expect(loginResult.token).toBeDefined();
    expect(loginResult.user.id).toBe(registerResult.user.id);
  });

  test('token refresh and validation cycle', async () => {
    // Test token creation + validation + refresh working together
    const loginResult = await loginController.handle(loginRequest);
    const validateResult = await authMiddleware.validateToken(loginResult.token);
    const refreshResult = await refreshTokenController.handle({ refreshToken: loginResult.refreshToken });
    
    expect(refreshResult.newToken).toBeDefined();
    expect(validateResult.user.id).toBe(refreshResult.user.id);
  });
});
```

### 2. **User Management Integration**
```typescript
// integration/user/profile-lifecycle.integration.test.ts  
describe('User Profile Management Integration', () => {
  test('complete profile lifecycle', async () => {
    // Test createUser + updateProfile + getProfile working together
    const user = await createUser(userData);
    const profile = await updateProfileController.handle(user.id, profileData);
    const retrievedProfile = await getUserProfileController.handle(user.id);
    
    expect(retrievedProfile.profile).toEqual(profile);
    expect(retrievedProfile.user.id).toBe(user.id);
  });

  test('username validation and uniqueness', async () => {
    // Test checkUsername + createUser + validation chain
    const checkResult = await checkUsernameController.handle('newusername');
    const user = await createUser({ ...userData, username: 'newusername' });
    const secondCheck = await checkUsernameController.handle('newusername');
    
    expect(checkResult.available).toBe(true);
    expect(secondCheck.available).toBe(false);
  });
});
```

### 3. **Content Management Integration**
```typescript
// integration/content/media-upload.integration.test.ts
describe('Content Management Integration', () => {
  test('basic media upload and storage flow', async () => {
    // Test upload + basic processing + storage + retrieval
    const upload = await uploadController.handle(imageFile, userId);
    const processed = await imageService.processBasicImage(upload.fileId);
    const stored = await storageService.storeMedia(processed);
    const retrieved = await contentController.getContent(stored.contentId);
    
    expect(processed.success).toBe(true);
    expect(stored.url).toBeDefined();
    expect(retrieved.accessible).toBe(true);
  });

  test('content access and ownership validation', async () => {
    // Test upload + ownership verification + access control
    const upload = await uploadController.handle(imageFile, userId);
    const ownerAccess = await accessController.verifyAccess(userId, upload.contentId);
    const unauthorizedAccess = await accessController.verifyAccess(otherUserId, upload.contentId);
    
    expect(ownerAccess.granted).toBe(true);
    expect(unauthorizedAccess.granted).toBe(false);
  });
});

### 4. **Chat System Integration**
```typescript
// integration/chat/message-flow.integration.test.ts
describe('Chat System Integration', () => {
  test('basic messaging workflow', async () => {
    // Test conversation creation + message sending + retrieval
    const conversation = await conversationController.create([userId1, userId2]);
    const message = await messageController.send(conversation.id, messageData, userId1);
    const messages = await messageController.getMessages(conversation.id, userId1);
    const conversations = await conversationController.list(userId1);
    
    expect(message.sent).toBe(true);
    expect(messages.messages).toContainEqual(expect.objectContaining({ id: message.id }));
    expect(conversations.conversations).toContainEqual(expect.objectContaining({ id: conversation.id }));
  });

  test('message validation and user permissions', async () => {
    // Test message content validation + user access validation
    const conversation = await conversationController.create([userId1, userId2]);
    const validMessage = await messageController.send(conversation.id, validMessageData, userId1);
    const invalidMessage = await messageController.send(conversation.id, invalidMessageData, userId1);
    const unauthorizedMessage = await messageController.send(conversation.id, messageData, userId3);
    
    expect(validMessage.success).toBe(true);
    expect(invalidMessage.success).toBe(false);
    expect(unauthorizedMessage.success).toBe(false);
  });
});

### 5. **Payment Processing Integration**
```typescript
// integration/payments/payment-basic.integration.test.ts
describe('Payment Processing Integration', () => {
  test('basic payment lifecycle', async () => {
    // Test payment creation + Stripe processing + confirmation
    const payment = await paymentController.create(paymentData);
    const stripeResult = await stripeService.createPaymentIntent(payment.id);
    const confirmed = await paymentController.confirm(payment.id);
    
    expect(stripeResult.success).toBe(true);
    expect(confirmed.status).toBe('completed');
  });

  test('payment validation and error handling', async () => {
    // Test amount validation + currency validation + user validation
    const validPayment = await paymentController.create(validPaymentData);
    const invalidAmount = await paymentController.create({ ...paymentData, amount: -100 });
    const invalidCurrency = await paymentController.create({ ...paymentData, currency: 'INVALID' });
    
    expect(validPayment.success).toBe(true);
    expect(invalidAmount.success).toBe(false);
    expect(invalidCurrency.success).toBe(false);
  });

  test('webhook processing workflow', async () => {
    // Test Stripe webhook handling + payment status updates
    const payment = await paymentController.create(paymentData);
    const webhook = await webhookController.handle(stripeWebhookData);
    const updated = await paymentController.getStatus(payment.id);
    
    expect(webhook.processed).toBe(true);
    expect(updated.status).toBe('paid');
  });
});

### 6. **Health Monitoring Integration**
```typescript
// integration/health/system-health.integration.test.ts
describe('Health System Integration', () => {
  test('comprehensive health check flow', async () => {
    // Test health status + database connectivity + system checks
    const healthStatus = await healthController.handle();
    const dbHealth = await dbHealthController.handle();
    const helloDb = await helloDbController.handle();
    
    expect(healthStatus.status).toBe('healthy');
    expect(dbHealth.database.connected).toBe(true);
    expect(helloDb.message).toContain('database');
  });

  test('CORS and preflight validation', async () => {
    // Test CORS headers + preflight requests + origin validation
    const corsResult = await corsMiddleware.handle(request);
    const preflightResult = await corsMiddleware.handlePreflight(preflightRequest);
    
    expect(corsResult.headers).toHaveProperty('Access-Control-Allow-Origin');
    expect(preflightResult.status).toBe(200);
  });
});
```

## Testing Commands - MVP Essential

### **Domain-Specific Integration Testing**
```bash
# Test all integration tests in specific domain
npm run test "integration/auth"
npm run test "integration/user"
npm run test "integration/content"
npm run test "integration/chat"
npm run test "integration/payments"
npm run test "integration/health"

# Test specific integration flow
npm run test "auth-flow.integration.test.ts"
npm run test "message-flow.integration.test.ts"
npm run test "media-upload.integration.test.ts"
npm run test "payment-basic.integration.test.ts"

# Test all integration tests across all domains
npm run test "integration/"
```

### **Test Type Separation**
```bash
# Run only integration tests
npm run test "integration/"

# Run only unit tests  
npm run test "apps/" --testNamePattern="\.test\."

# Run only E2E tests
npm run test "e2e/"

# Run all tests
npm run test
```

### **MVP Development Workflow**
```bash
# 1. Write integration test first (TDD Red phase)
npm run test "integration/auth" # Should fail

# 2. Implement controllers/services (TDD Green phase)  
npm run test "integration/auth" # Should pass

# 3. Test specific domain integration
npm run test "integration/payments"
npm run test "integration/content"

# 4. Run all integration tests before E2E
npm run test "integration/"
```

## Essential MVP Integration Coverage

### 🔐 **Authentication Domain**
- **Auth Flow**: Registration → Login → Token validation → Logout
- **Token Management**: Token refresh → Validation → Expiration handling
- **Validation Chain**: Email validation → Password validation → User creation

### 👤 **User Management Domain**
- **Profile Lifecycle**: User creation → Profile setup → Updates → Retrieval
- **Username Management**: Availability checking → Uniqueness validation
- **Search & Discovery**: User search → Basic filtering

### 📁 **Content Management Domain**
- **Media Upload**: Basic file upload → Processing → Storage
- **Image Processing**: Basic image transformation → Optimization
- **Content Access**: Ownership validation → Access control → Retrieval

### 💬 **Chat System Domain**
- **Message Flow**: Conversation creation → Message sending → Retrieval
- **Basic Messaging**: User-to-user communication → Message validation
- **Conversation Management**: Basic conversation listing → User permissions

### 💳 **Payment Processing Domain**
- **Basic Payments**: Payment creation → Stripe processing → Confirmation
- **Payment Validation**: Amount validation → Currency validation → User verification
- **Webhook Handling**: Basic Stripe webhook processing → Status updates

### 🔍 **Health Monitoring Domain**
- **System Health**: Application status → Database connectivity
- **CORS Validation**: Preflight handling → Origin validation
- **API Endpoints**: Health endpoints → Response validation

### 🛠️ **Shared Infrastructure Domain**
- **Database Operations**: Connection → Query validation → Transaction handling
- **Middleware Chain**: Auth middleware → Route protection → User context
- **Error Handling**: Validation failures → System errors → Recovery

## Key Benefits for MVP

### 🚀 **Clear Separation of Test Types**
- **Unit tests**: Stay in `apps/` near code
- **Integration tests**: Centralized in `integration/` 
- **E2E tests**: Cross-app flows in `e2e/`
- **No confusion**: Developers know exactly where tests belong

### ⚡ **Fast Development Feedback**
- **Domain-focused**: Test specific business domains independently
- **Quick execution**: Vitest runs integration tests faster than E2E
- **Parallel testing**: Multiple domains can be tested simultaneously
- **TDD-friendly**: Easy to write failing tests first

### 🔧 **Scalable Architecture**
- **Future-ready**: Easy to add new domains without restructuring
- **AI-friendly**: Predictable structure for AI coding tools
- **Clean commands**: Simple, memorable test commands
- **Maintainable**: Tests organized by business domain, not technical layer

### 📦 **Complete MVP Coverage**
- **All essential features**: Auth, User, Content, Chat, Payments, Health
- **Core workflows**: Registration → Content creation → Monetization → Communication
- **Platform viability**: All components needed for functioning creator platform

## Integration Test Scope - MVP

### ✅ **What Integration Tests Cover**
- Multiple controllers working in sequence within same domain
- Service layer + database operations + data transformations
- Component interaction patterns and data flow within domain
- Error handling between components and services
- Business logic workflows within domain boundaries
- Authentication and authorization within domain
- Basic external service integration (Stripe, media processing)

### ❌ **What Integration Tests Don't Cover**
- Cross-app communication (E2E handles this)
- Real browser interactions (E2E handles this)
- Actual external API calls (mocked in integration tests)
- Complete user journeys across multiple apps (E2E handles this)
- Frontend UI interactions (E2E handles this)
- Advanced real-time features (WebSocket testing in E2E)

## Relationship to E2E Testing - MVP

```typescript
// Development Flow:
Unit Tests → Integration Tests → E2E Tests

// Example: Essential Creator Journey - MVP
1. Unit: ValidationService.test.ts (email validation)
2. Integration: auth-flow.integration.test.ts (register + login flow)  
3. Integration: profile-lifecycle.integration.test.ts (profile setup)
4. Integration: media-upload.integration.test.ts (content upload)
5. Integration: payment-basic.integration.test.ts (basic monetization)
6. Integration: message-flow.integration.test.ts (creator-fan communication)
7. E2E: operations/mvpCreatorJourney.ts (register → profile → upload → monetize → chat)
```

Integration tests provide the **essential middle layer** for MVP - more comprehensive than unit tests, faster than E2E tests, focused on **within-domain component collaboration** covering all core business functionality needed for a viable creator platform.