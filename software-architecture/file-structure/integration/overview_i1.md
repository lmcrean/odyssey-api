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
│   │   │   ├── auth-flow.integration.test.ts          # Login + Register + Logout flow
│   │   │   ├── token-management.integration.test.ts   # Token refresh + validation cycle
│   │   │   ├── validation.integration.test.ts         # ValidationService + AuthService
│   │   │   ├── middleware-auth.integration.test.ts    # Auth middleware + route protection
│   │   │   ├── LoginController.test.ts                # Unit test (single controller)
│   │   │   └── ValidationService.test.ts              # Unit test (single service)
│   │   ├── routes/login/Controller.ts
│   │   ├── routes/register/Controller.ts
│   │   ├── routes/logout/Controller.ts
│   │   ├── routes/refresh-token/Controller.ts
│   │   └── services/AuthService.ts
│   ├── user/
│   │   ├── __tests__/
│   │   │   ├── profile-management.integration.test.ts  # Get + Update + Delete profile
│   │   │   ├── user-search.integration.test.ts         # Search + Filter + Pagination
│   │   │   ├── username-validation.integration.test.ts # Check username + validation
│   │   │   ├── public-profile.integration.test.ts      # Public profile data + privacy
│   │   │   └── unified-model.integration.test.ts       # Database operations together
│   │   ├── routes/getUserProfile/Controller.ts
│   │   ├── routes/updateProfile/Controller.ts
│   │   ├── routes/searchUsers/Controller.ts
│   │   ├── routes/checkUsername/Controller.ts
│   │   ├── routes/getPublicProfile/Controller.ts
│   │   └── models/database/
│   ├── content/
│   │   ├── __tests__/
│   │   │   ├── image-lifecycle.integration.test.ts     # Upload + Process + Store + Retrieve
│   │   │   ├── content-management.integration.test.ts  # Create + Update + Delete + List
│   │   │   ├── media-processing.integration.test.ts    # Upload + Validation + Storage
│   │   │   ├── cloudinary-integration.integration.test.ts # Cloudinary + validation + storage
│   │   │   └── content-permissions.integration.test.ts # Content access + ownership validation
│   │   ├── routes/upload/Controller.ts
│   │   ├── routes/delete/Controller.ts
│   │   ├── routes/view/Controller.ts
│   │   ├── services/MediaService.ts
│   │   └── services/CloudinaryService.ts
│   ├── chat/
│   │   ├── __tests__/
│   │   │   ├── message-flow.integration.test.ts        # Send + Retrieve + Update messages
│   │   │   ├── conversation-management.integration.test.ts # Create + List + Delete conversations
│   │   │   ├── message-validation.integration.test.ts  # Message content + user validation
│   │   │   └── chat-permissions.integration.test.ts    # User access + conversation ownership
│   │   ├── routes/sendMessage/Controller.ts
│   │   ├── routes/getMessages/Controller.ts
│   │   ├── routes/getConversationList/Controller.ts
│   │   ├── models/database/
│   │   └── services/ChatService.ts
│   ├── payments/
│   │   ├── __tests__/
│   │   │   ├── stripe-integration.integration.test.ts  # Payment + Webhook + Validation
│   │   │   ├── payment-flow.integration.test.ts        # Create + Process + Confirm
│   │   │   ├── webhook-processing.integration.test.ts  # Webhook + Database updates
│   │   │   ├── payment-validation.integration.test.ts  # Amount + currency + user validation
│   │   │   └── subscription-management.integration.test.ts # Create + Update + Cancel subscriptions
│   │   ├── routes/create/Controller.ts
│   │   ├── routes/process/Controller.ts
│   │   ├── routes/confirm/Controller.ts
│   │   ├── routes/webhook/Controller.ts
│   │   └── services/StripeService.ts
│   └── health/
│       ├── __tests__/
│       │   ├── health-monitoring.integration.test.ts   # Health + DB + External services
│       │   ├── database-connectivity.integration.test.ts # DB connection + query validation
│       │   └── cors-validation.integration.test.ts     # CORS + preflight + headers
│       ├── routes/health/Controller.ts
│       ├── routes/db-health/Controller.ts
│       ├── routes/hello/Controller.ts
│       └── routes/hello-db/Controller.ts
```

## Essential Integration Test Patterns

### 1. **Authentication Flow Integration**
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
// apps/user/__tests__/profile-management.integration.test.ts  
describe('User Profile Management Integration', () => {
  test('complete profile lifecycle', async () => {
    // Test createUser + updateProfile + getProfile + getPublicProfile working together
    const user = await createUser(userData);
    const profile = await updateProfileController.handle(user.id, profileData);
    const privateProfile = await getUserProfileController.handle(user.id);
    const publicProfile = await getPublicProfileController.handle(user.id);
    
    expect(privateProfile.profile).toEqual(profile);
    expect(publicProfile.profile).not.toHaveProperty('email'); // Privacy check
  });

  test('username validation and uniqueness', async () => {
    // Test checkUsername + createUser + updateProfile username changes
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
// apps/content/__tests__/image-lifecycle.integration.test.ts
describe('Content Lifecycle Integration', () => {
  test('complete image upload and processing flow', async () => {
    // Test upload + CloudinaryService + validation + storage + retrieval
    const uploadResult = await uploadController.handle(imageFile, userId);
    const cloudinaryResult = await cloudinaryService.processImage(uploadResult.imageId);
    const retrievedContent = await viewContentController.handle(uploadResult.contentId);
    
    expect(cloudinaryResult.success).toBe(true);
    expect(retrievedContent.content.processedUrls).toBeDefined();
  });

  test('content permissions and ownership', async () => {
    // Test upload + ownership validation + access control
    const upload = await uploadController.handle(imageFile, userId);
    const ownerAccess = await viewContentController.handle(upload.contentId, userId);
    const unauthorizedAccess = await viewContentController.handle(upload.contentId, otherUserId);
    
    expect(ownerAccess.success).toBe(true);
    expect(unauthorizedAccess.success).toBe(false);
  });
});
```

### 4. **Chat System Integration**
```typescript
// apps/chat/__tests__/message-flow.integration.test.ts
describe('Chat Message Flow Integration', () => {
  test('complete messaging workflow', async () => {
    // Test conversation creation + message sending + retrieval
    const conversation = await createConversation([userId1, userId2]);
    const message = await sendMessageController.handle(conversation.id, messageData, userId1);
    const messages = await getMessagesController.handle(conversation.id, userId1);
    const conversations = await getConversationListController.handle(userId1);
    
    expect(messages.messages).toContainEqual(expect.objectContaining({ id: message.id }));
    expect(conversations.conversations).toContainEqual(expect.objectContaining({ id: conversation.id }));
  });

  test('message validation and user permissions', async () => {
    // Test message content validation + user access validation
    const conversation = await createConversation([userId1, userId2]);
    const validMessage = await sendMessageController.handle(conversation.id, validMessageData, userId1);
    const invalidMessage = await sendMessageController.handle(conversation.id, invalidMessageData, userId1);
    const unauthorizedMessage = await sendMessageController.handle(conversation.id, messageData, userId3);
    
    expect(validMessage.success).toBe(true);
    expect(invalidMessage.success).toBe(false);
    expect(unauthorizedMessage.success).toBe(false);
  });
});
```

### 5. **Payment Processing Integration**
```typescript
// apps/payments/__tests__/payment-flow.integration.test.ts
describe('Payment Processing Integration', () => {
  test('complete payment lifecycle', async () => {
    // Test payment creation + Stripe processing + webhook handling + confirmation
    const payment = await createPaymentController.handle(paymentData);
    const stripeResult = await stripeService.createPaymentIntent(payment.id);
    const webhook = await webhookController.handle(stripeWebhookData);
    const confirmed = await confirmPaymentController.handle(payment.id);
    
    expect(stripeResult.success).toBe(true);
    expect(confirmed.status).toBe('completed');
  });

  test('payment validation and error handling', async () => {
    // Test amount validation + currency validation + user validation
    const validPayment = await createPaymentController.handle(validPaymentData);
    const invalidAmount = await createPaymentController.handle({ ...paymentData, amount: -100 });
    const invalidCurrency = await createPaymentController.handle({ ...paymentData, currency: 'INVALID' });
    
    expect(validPayment.success).toBe(true);
    expect(invalidAmount.success).toBe(false);
    expect(invalidCurrency.success).toBe(false);
  });
});
```

### 6. **Health Monitoring Integration**
```typescript
// apps/health/__tests__/health-monitoring.integration.test.ts
describe('Health Monitoring Integration', () => {
  test('comprehensive health check flow', async () => {
    // Test health status + database connectivity + external service checks
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

## Testing Commands

### **Domain-Specific Integration Testing**
```bash
# Test all integration tests in specific app
npm run test "apps/auth" --testNamePattern="integration"
npm run test "apps/user" --testNamePattern="integration"
npm run test "apps/content" --testNamePattern="integration"
npm run test "apps/chat" --testNamePattern="integration"
npm run test "apps/payments" --testNamePattern="integration"
npm run test "apps/health" --testNamePattern="integration"

# Test specific integration flow
npm run test "auth-flow.integration.test.ts"
npm run test "message-flow.integration.test.ts"
npm run test "payment-flow.integration.test.ts"

# Test all integration tests across all apps  
npm run test --testNamePattern="integration"
```

### **Workflow-Specific Testing**
```bash
# Test authentication workflows
npm run test "auth-flow.integration.test.ts"
npm run test "token-management.integration.test.ts"

# Test user management workflows
npm run test "profile-management.integration.test.ts"
npm run test "user-search.integration.test.ts"

# Test content workflows
npm run test "image-lifecycle.integration.test.ts"
npm run test "content-management.integration.test.ts"

# Test chat workflows
npm run test "message-flow.integration.test.ts"
npm run test "conversation-management.integration.test.ts"

# Test payment workflows
npm run test "payment-flow.integration.test.ts"
npm run test "stripe-integration.integration.test.ts"
```

### **Integration vs Unit Test Separation**
```bash
# Run only integration tests
npm run test --testNamePattern="integration"

# Run only unit tests (exclude integration)
npm run test --testNamePattern="^(?!.*integration).*test"

# Run all tests in specific app
npm run test "apps/auth"
npm run test "apps/user"
npm run test "apps/content"
npm run test "apps/chat"
npm run test "apps/payments"
```

## Essential Integration Coverage

### 🔐 **Authentication Domain**
- **Auth Flow**: Registration → Login → Token validation → Logout
- **Token Management**: Token refresh → Validation → Expiration handling
- **Middleware Integration**: Auth middleware → Route protection → User context
- **Validation Chain**: Email validation → Password validation → User creation

### 👤 **User Management Domain**
- **Profile Lifecycle**: User creation → Profile setup → Updates → Public/private views
- **Search & Discovery**: User search → Filtering → Pagination → Results formatting
- **Username Management**: Availability checking → Uniqueness validation → Updates
- **Privacy Controls**: Public profile data → Private data protection → Access control

### 📁 **Content Management Domain**
- **Media Lifecycle**: Upload → Processing → Validation → Storage → Retrieval
- **Cloudinary Integration**: Image processing → Transformation → URL generation → Storage
- **Content Permissions**: Ownership validation → Access control → Sharing permissions
- **File Validation**: File type validation → Size limits → Content scanning

### 💬 **Chat System Domain**
- **Message Flow**: Conversation creation → Message sending → Retrieval → Updates
- **Conversation Management**: Creation → Listing → Deletion → User management
- **Message Validation**: Content validation → User permissions → Rate limiting
- **Real-time Sync**: Message delivery → Read receipts → Typing indicators

### 💳 **Payment Processing Domain**
- **Payment Flow**: Creation → Processing → Webhook handling → Confirmation
- **Stripe Integration**: Payment intent → Processing → Webhook validation → Status updates
- **Payment Validation**: Amount validation → Currency validation → User verification
- **Subscription Management**: Creation → Updates → Cancellation → Billing cycles

### 🔍 **Health Monitoring Domain**
- **System Health**: Application status → Database connectivity → External services
- **Database Health**: Connection testing → Query validation → Performance monitoring
- **CORS Validation**: Preflight handling → Origin validation → Header management
- **API Endpoints**: Health endpoints → Response validation → Error handling

## Key Benefits

### 🚀 **Within-App Component Verification**
- **Multi-component flows**: Controllers + Services + Models working together
- **Database integration**: Real database operations with test data
- **Service layer testing**: Business logic with dependencies
- **Error handling**: How components handle failures together
- **Data transformation**: Input validation + processing + output formatting

### ⚡ **Fast Execution**
- **No browser overhead**: Vitest runs in Node.js
- **Mocked externals**: Mock external APIs, real internal components
- **Parallel execution**: Multiple integration tests run simultaneously
- **Quick feedback**: Faster than E2E, more comprehensive than unit tests
- **Isolated testing**: Each app domain tested independently

### 🔧 **Development Workflow**
```typescript
// TDD Workflow with Integration Tests
1. Write failing integration test (Red)
2. Implement controllers/services to pass (Green)  
3. Refactor while keeping tests green (Refactor)
4. Run E2E tests to verify cross-app flows
5. Deploy with confidence
```

### 🧪 **Comprehensive Coverage**
- **All essential domains**: Auth, User, Content, Chat, Payments, Health
- **All critical workflows**: Registration to payment completion
- **All integration points**: Service interactions, database operations, external APIs
- **All error scenarios**: Validation failures, permission errors, system failures

## Integration Test Scope

### ✅ **What Integration Tests Cover**
- Multiple controllers working in sequence within same app
- Service layer + database operations + data transformations
- Component interaction patterns and data flow
- Error handling between components and services
- Business logic workflows within app domain
- External service integration (mocked but realistic)
- Authentication and authorization within app
- Data validation and transformation pipelines

### ❌ **What Integration Tests Don't Cover**
- Cross-app communication (E2E handles this)
- Real browser interactions (E2E handles this)
- Actual external API calls (mocked in integration tests)
- Complete user journeys across multiple apps (E2E handles this)
- Frontend UI interactions (E2E handles this)
- Real-time WebSocket connections (E2E handles this)

## Relationship to E2E Testing

```typescript
// Development Flow:
Unit Tests → Integration Tests → E2E Tests

// Example: Complete Creator Journey
1. Unit: ValidationService.test.ts (email validation)
2. Integration: auth-flow.integration.test.ts (register + login flow)  
3. Integration: content-management.integration.test.ts (upload + process flow)
4. Integration: payment-flow.integration.test.ts (create + process flow)
5. E2E: operations/creatorJourney.ts (register → upload → payment across apps)
```

Integration tests provide the **essential middle layer** - more comprehensive than unit tests, faster than E2E tests, focused on **within-app component collaboration** covering all essential business domains and workflows.
