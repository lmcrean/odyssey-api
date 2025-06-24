# Integration Testing Architecture - API-First Integration Tests

> **Integration Testing Strategy**: Test multiple components working together within the same domain using root-level integration directory with API-first approach

## Overview
Integration tests verify that multiple units (controllers, services, models) work correctly together within a single domain. Unlike E2E tests that test across apps with real browsers, integration tests focus on **within-domain component interaction** using Vitest with **API-first testing approach**.

## Integration vs E2E Distinction

### 🔧 **Integration Tests (Vitest) - Within Domain, API-First**
```typescript
// Location: integration/{domain}/
// Purpose: Test multiple components within same domain working together
// Tool: Vitest (fast, no browser)
// Scope: Single domain
// API-First: Test API endpoints first, then Web interfaces

integration/auth/auth-flow.api.test.ts
// Tests: LoginController + ValidationService + AuthService + Database (API)
// Mocks: External APIs, browser interactions

integration/auth/auth-flow.web.test.ts  
// Tests: Frontend auth forms + API integration + UI state management (Web)
// Mocks: External APIs, simulated browser interactions via jsdom
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

## Integration Test Structure - API-First MVP Essential

### **Root-Level Integration Directory**
```typescript
odyssey/
├── apps/
├── integration/                                         # Root-level integration tests
│   ├── auth/
│   │   ├── auth-flow.api.test.ts                        # Register → Login → Logout (API)
│   │   ├── auth-flow.web.test.ts                        # Auth forms + UI state management (Web)
│   │   ├── token-management.api.test.ts                 # Token refresh cycle (API)
│   │   ├── token-management.web.test.ts                 # Token UI handling + storage (Web)
│   │   ├── validation-chain.api.test.ts                 # Email + password validation (API)
│   │   └── validation-chain.web.test.ts                 # Form validation + error display (Web)
│   ├── user/
│   │   ├── profile-lifecycle.api.test.ts                # Create → Update → Get profile (API)
│   │   ├── profile-lifecycle.web.test.ts                # Profile forms + UI updates (Web)
│   │   ├── username-validation.api.test.ts              # Check + validate username (API)
│   │   ├── username-validation.web.test.ts              # Username form validation (Web)
│   │   ├── search-users.api.test.ts                     # Search + filter users (API)
│   │   └── search-users.web.test.ts                     # Search UI + results display (Web)
│   ├── content/
│   │   ├── media-upload.api.test.ts                     # Basic upload + storage (API)
│   │   ├── media-upload.web.test.ts                     # Upload forms + progress UI (Web)
│   │   ├── image-processing.api.test.ts                 # Basic image processing (API)
│   │   ├── image-processing.web.test.ts                 # Image preview + processing UI (Web)
│   │   ├── content-access.api.test.ts                   # View + download content (API)
│   │   └── content-access.web.test.ts                   # Content display + interaction (Web)
│   ├── chat/
│   │   ├── message-flow.api.test.ts                     # Send + receive messages (API)
│   │   ├── message-flow.web.test.ts                     # Chat UI + real-time updates (Web)
│   │   ├── conversation-basic.api.test.ts               # Create + list conversations (API)
│   │   ├── conversation-basic.web.test.ts               # Conversation UI + navigation (Web)
│   │   ├── message-validation.api.test.ts               # Message content validation (API)
│   │   └── message-validation.web.test.ts               # Message form validation (Web)
│   ├── payments/
│   │   ├── payment-basic.api.test.ts                    # Create + process payments (API)
│   │   ├── payment-basic.web.test.ts                    # Payment forms + Stripe UI (Web)
│   │   ├── stripe-webhook.api.test.ts                   # Basic webhook handling (API)
│   │   ├── stripe-webhook.web.test.ts                   # Webhook status updates UI (Web)
│   │   ├── payment-validation.api.test.ts               # Amount + user validation (API)
│   │   └── payment-validation.web.test.ts               # Payment form validation (Web)
│   ├── ai/                                              # AI app integration tests (Future)
│   │   ├── chat-completion.api.test.ts                  # AI chat endpoints (API)
│   │   ├── chat-completion.web.test.ts                  # AI chat UI + streaming (Web)
│   │   ├── content-generation.api.test.ts               # AI content generation (API)
│   │   └── content-generation.web.test.ts               # Content generation UI (Web)
│   ├── workers/                                         # Background workers tests (Future)
│   │   ├── media-processing.api.test.ts                 # Media processing jobs (API)
│   │   ├── notification-jobs.api.test.ts                # Notification jobs (API)
│   │   └── analytics-jobs.api.test.ts                   # Analytics processing (API)
│   ├── health/
│   │   ├── system-health.api.test.ts                    # Health + DB connectivity (API)
│   │   ├── system-health.web.test.ts                    # Health dashboard UI (Web)
│   │   ├── cors-validation.api.test.ts                  # CORS + preflight handling (API)
│   │   └── cors-validation.web.test.ts                  # CORS status display (Web)
│   └── shared/
│       ├── database-operations.api.test.ts              # Core DB operations (API)
│       ├── database-operations.web.test.ts              # DB status UI components (Web)
│       ├── middleware-auth.api.test.ts                  # Auth middleware chain (API)
│       └── middleware-auth.web.test.ts                  # Auth state management (Web)
```

## Essential MVP Integration Test Patterns - API-First

### 1. **Authentication Flow Integration - API**
```typescript
// integration/auth/auth-flow.api.test.ts
describe('Authentication Flow Integration - API', () => {
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

### 2. **Authentication Flow Integration - Web**
```typescript
// integration/auth/auth-flow.web.test.ts
describe('Authentication Flow Integration - Web', () => {
  test('complete registration form and UI state management', async () => {
    // Test form validation + API integration + UI state updates
    const { container } = render(<RegistrationForm />);
    
    // Fill form and submit
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'TestPassword123!' } });
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Wait for API call and UI updates
    await waitFor(() => {
      expect(screen.getByTestId('registration-success')).toBeInTheDocument();
    });
    
    expect(mockApiCall).toHaveBeenCalledWith('/api/auth/register', expect.any(Object));
  });

  test('login form validation and error handling', async () => {
    // Test form validation + error display + retry logic
    const { container } = render(<LoginForm />);
    
    // Submit empty form
    fireEvent.click(screen.getByTestId('login-button'));
    expect(screen.getByTestId('email-error')).toBeInTheDocument();
    expect(screen.getByTestId('password-error')).toBeInTheDocument();
    
    // Test invalid credentials response
    mockApiCall.mockRejectedValue({ status: 401, message: 'Invalid credentials' });
    
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid credentials');
    });
  });
});
```

### 3. **User Management Integration - API**
```typescript
// integration/user/profile-lifecycle.api.test.ts  
describe('User Profile Management Integration - API', () => {
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

### 4. **User Management Integration - Web**
```typescript
// integration/user/profile-lifecycle.web.test.ts
describe('User Profile Management Integration - Web', () => {
  test('profile update form and real-time validation', async () => {
    // Test profile form + API integration + optimistic updates
    const { container } = render(<ProfileUpdateForm initialData={profileData} />);
    
    // Update profile fields
    fireEvent.change(screen.getByTestId('displayName'), { target: { value: 'New Display Name' } });
    fireEvent.change(screen.getByTestId('bio'), { target: { value: 'Updated bio' } });
    
    // Test real-time validation
    expect(screen.getByTestId('character-count')).toHaveTextContent('11/100');
    
    // Submit and verify optimistic updates
    fireEvent.click(screen.getByTestId('save-profile'));
    
    // Should show optimistic update immediately
    expect(screen.getByDisplayValue('New Display Name')).toBeInTheDocument();
    expect(screen.getByTestId('saving-indicator')).toBeInTheDocument();
    
    // Wait for API response
    await waitFor(() => {
      expect(screen.getByTestId('save-success')).toBeInTheDocument();
      expect(screen.queryByTestId('saving-indicator')).not.toBeInTheDocument();
    });
  });

  test('username availability checking with debounce', async () => {
    // Test username input + debounced API calls + validation UI
    const { container } = render(<UsernameField />);
    
    // Type username and verify debouncing
    fireEvent.change(screen.getByTestId('username'), { target: { value: 'newuser' } });
    
    // Should not call API immediately
    expect(mockApiCall).not.toHaveBeenCalled();
    
    // Wait for debounce
    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith('/api/users/check-username?username=newuser');
    }, { timeout: 1000 });
    
    // Verify availability indicator
    await waitFor(() => {
      expect(screen.getByTestId('username-available')).toBeInTheDocument();
    });
  });
});
```

### 5. **Content Management Integration - API**
```typescript
// integration/content/media-upload.api.test.ts
describe('Content Management Integration - API', () => {
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
```

### 6. **Content Management Integration - Web**
```typescript
// integration/content/media-upload.web.test.ts
describe('Content Management Integration - Web', () => {
  test('file upload with progress and preview', async () => {
    // Test file input + upload progress + preview generation
    const { container } = render(<MediaUploadForm />);
    
    const file = new File(['test image content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');
    
    // Upload file and verify preview
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      expect(screen.getByTestId('file-name')).toHaveTextContent('test.jpg');
    });
    
    // Start upload and monitor progress
    fireEvent.click(screen.getByTestId('upload-button'));
    
    expect(screen.getByTestId('upload-progress')).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toHaveAttribute('value', '0');
    
    // Simulate progress updates
    await waitFor(() => {
      expect(screen.getByTestId('upload-success')).toBeInTheDocument();
    });
  });

  test('image processing and optimization UI', async () => {
    // Test image editing tools + real-time preview + optimization
    const { container } = render(<ImageEditor imageUrl={testImageUrl} />);
    
    // Test crop functionality
    fireEvent.click(screen.getByTestId('crop-tool'));
    fireEvent.mouseDown(screen.getByTestId('crop-handle'));
    
    // Verify real-time preview updates
    expect(screen.getByTestId('preview-image')).toHaveStyle('transform: scale(0.8)');
    
    // Test optimization settings
    fireEvent.change(screen.getByTestId('quality-slider'), { target: { value: '80' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('file-size-estimate')).toHaveTextContent(/~\d+KB/);
    });
  });
});
```

### 7. **Chat System Integration - API**
```typescript
// integration/chat/message-flow.api.test.ts
describe('Chat System Integration - API', () => {
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
```

### 8. **Chat System Integration - Web**
```typescript
// integration/chat/message-flow.web.test.ts
describe('Chat System Integration - Web', () => {
  test('real-time messaging UI and state management', async () => {
    // Test message form + real-time updates + conversation state
    const { container } = render(<ChatInterface conversationId={conversationId} />);
    
    // Send message
    fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Hello there!' } });
    fireEvent.click(screen.getByTestId('send-button'));
    
    // Verify optimistic update
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(screen.getByTestId('message-sending')).toBeInTheDocument();
    
    // Wait for message confirmation
    await waitFor(() => {
      expect(screen.getByTestId('message-sent')).toBeInTheDocument();
      expect(screen.queryByTestId('message-sending')).not.toBeInTheDocument();
    });
    
    // Simulate receiving a message
    act(() => {
      mockWebSocket.simulateMessage({
        id: 'msg-2',
        content: 'Hello back!',
        senderId: otherUserId,
        timestamp: new Date().toISOString()
      });
    });
    
    expect(screen.getByText('Hello back!')).toBeInTheDocument();
  });

  test('conversation list and unread message indicators', async () => {
    // Test conversation list + unread counts + real-time updates
    const { container } = render(<ConversationList />);
    
    // Verify conversation list loads
    await waitFor(() => {
      expect(screen.getByTestId('conversation-list')).toBeInTheDocument();
      expect(screen.getAllByTestId('conversation-item')).toHaveLength(3);
    });
    
    // Test unread message indicator
    expect(screen.getByTestId('unread-count-1')).toHaveTextContent('2');
    
    // Click conversation and verify unread count clears
    fireEvent.click(screen.getByTestId('conversation-1'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('unread-count-1')).not.toBeInTheDocument();
    });
  });
});
```

### 9. **Payment Processing Integration - API**
```typescript
// integration/payments/payment-basic.api.test.ts
describe('Payment Processing Integration - API', () => {
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
```

### 10. **Payment Processing Integration - Web**
```typescript
// integration/payments/payment-basic.web.test.ts
describe('Payment Processing Integration - Web', () => {
  test('Stripe payment form and processing flow', async () => {
    // Test Stripe Elements + payment flow + status updates
    const { container } = render(<PaymentForm amount={100} />);
    
    // Wait for Stripe Elements to load
    await waitFor(() => {
      expect(screen.getByTestId('stripe-card-element')).toBeInTheDocument();
    });
    
    // Fill payment form
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '100' } });
    
    // Simulate Stripe card input (mocked)
    mockStripeElements.card.update({ complete: true });
    
    // Submit payment
    fireEvent.click(screen.getByTestId('pay-button'));
    
    // Verify processing state
    expect(screen.getByTestId('payment-processing')).toBeInTheDocument();
    expect(screen.getByTestId('pay-button')).toBeDisabled();
    
    // Wait for payment success
    await waitFor(() => {
      expect(screen.getByTestId('payment-success')).toBeInTheDocument();
    });
  });

  test('payment history and status tracking', async () => {
    // Test payment history list + status updates + refund UI
    const { container } = render(<PaymentHistory userId={userId} />);
    
    // Verify payment list loads
    await waitFor(() => {
      expect(screen.getAllByTestId('payment-item')).toHaveLength(5);
    });
    
    // Test status filtering
    fireEvent.click(screen.getByTestId('filter-completed'));
    
    await waitFor(() => {
      expect(screen.getAllByTestId('payment-item')).toHaveLength(3);
      expect(screen.getAllByText('Completed')).toHaveLength(3);
    });
    
    // Test refund request
    fireEvent.click(screen.getByTestId('refund-button-1'));
    
    expect(screen.getByTestId('refund-modal')).toBeInTheDocument();
  });
});
```

## Testing Commands - API-First MVP Essential

### **Domain-Specific Integration Testing**
```bash
# Test all API integration tests in specific domain
npm run test "integration/auth" -- "*.api.test.ts"
npm run test "integration/user" -- "*.api.test.ts"
npm run test "integration/content" -- "*.api.test.ts"
npm run test "integration/chat" -- "*.api.test.ts"
npm run test "integration/payments" -- "*.api.test.ts"

# Test all Web integration tests in specific domain  
npm run test "integration/auth" -- "*.web.test.ts"
npm run test "integration/user" -- "*.web.test.ts"
npm run test "integration/content" -- "*.web.test.ts"
npm run test "integration/chat" -- "*.web.test.ts"
npm run test "integration/payments" -- "*.web.test.ts"

# Test both API and Web for specific domain
npm run test "integration/auth"
npm run test "integration/user"
npm run test "integration/content"

# Test specific integration flow
npm run test "auth-flow.api.test.ts"
npm run test "auth-flow.web.test.ts"
npm run test "message-flow.api.test.ts"
npm run test "message-flow.web.test.ts"
```

### **API-First Testing Strategy**
```bash
# Phase 1: Test all API integrations first
npm run test "integration/" -- "*.api.test.ts"

# Phase 2: Test all Web integrations after APIs pass
npm run test "integration/" -- "*.web.test.ts"

# Phase 3: Test all integrations together
npm run test "integration/"
```

### **Test Type Separation**
```bash
# Run only API integration tests
npm run test "integration/" -- "*.api.test.ts"

# Run only Web integration tests  
npm run test "integration/" -- "*.web.test.ts"

# Run only unit tests  
npm run test "apps/" -- "*.test.ts"

# Run only E2E tests
npm run test "e2e/"

# Run all tests
npm run test
```

### **MVP Development Workflow - API-First**
```bash
# 1. Write API integration test first (TDD Red phase)
npm run test "integration/auth" -- "*.api.test.ts" # Should fail

# 2. Implement API controllers/services (TDD Green phase)  
npm run test "integration/auth" -- "*.api.test.ts" # Should pass

# 3. Write Web integration test (TDD Red phase)
npm run test "integration/auth" -- "*.web.test.ts" # Should fail

# 4. Implement Web components (TDD Green phase)
npm run test "integration/auth" -- "*.web.test.ts" # Should pass

# 5. Test complete domain integration
npm run test "integration/auth"

# 6. Run all integrations before E2E
npm run test "integration/"
```

## Essential MVP Integration Coverage - API-First

### 🔐 **Authentication Domain**
- **API**: Registration → Login → Token validation → Logout → Refresh tokens
- **Web**: Auth forms → Validation UI → Token storage → Auth state management
- **Integration**: API + Web auth flow working together

### 👤 **User Management Domain**
- **API**: User creation → Profile updates → Search functionality → Username validation
- **Web**: Profile forms → Real-time validation → Search UI → Optimistic updates
- **Integration**: API + Web user management working together

### 📁 **Content Management Domain**
- **API**: File upload → Processing → Storage → Access control → Retrieval
- **Web**: Upload forms → Progress indicators → Preview generation → Content display
- **Integration**: API + Web content lifecycle working together

### 💬 **Chat System Domain**
- **API**: Conversation creation → Message sending → Retrieval → Permissions
- **Web**: Chat UI → Real-time updates → Message forms → Conversation management
- **Integration**: API + Web messaging working together

### 💳 **Payment Processing Domain**
- **API**: Payment creation → Stripe processing → Webhook handling → Status updates
- **Web**: Payment forms → Stripe Elements → Processing UI → Payment history
- **Integration**: API + Web payment flow working together

### 🤖 **AI Integration Domain** (Future)
- **API**: AI chat endpoints → Content generation → Model management
- **Web**: AI chat UI → Content generation forms → Streaming responses
- **Integration**: API + Web AI features working together

### ⚡ **Workers Domain** (Future)
- **API**: Background job processing → Queue management → Status tracking
- **Integration**: Job processing + status updates working together

### 🔍 **Health Monitoring Domain**
- **API**: System health → Database connectivity → CORS validation
- **Web**: Health dashboard → Status displays → System monitoring UI
- **Integration**: API + Web health monitoring working together

### 🛠️ **Shared Infrastructure Domain**
- **API**: Database operations → Middleware chains → Error handling
- **Web**: Error boundaries → Loading states → Auth state management
- **Integration**: API + Web infrastructure working together

## Key Benefits for MVP - API-First

### 🚀 **API-First Confidence**
- **API tests first**: Validate backend functionality before building UI
- **Web tests second**: Test frontend integrations with working APIs
- **Clear separation**: Backend vs frontend integration issues easily identified
- **Faster debugging**: API failures caught early, UI issues isolated

### ⚡ **Fast Development Feedback**
- **Domain-focused**: Test specific business domains independently
- **Quick execution**: Vitest runs integration tests faster than E2E
- **Parallel testing**: API and Web tests can run independently
- **TDD-friendly**: Easy to write failing tests first, implement incrementally

### 🔧 **Scalable Architecture**
- **Future-ready**: Easy to add AI and Workers app tests without restructuring
- **AI-friendly**: Predictable structure for AI coding tools (.api.test.ts + .web.test.ts)
- **Clean commands**: Simple, memorable test commands with clear API/Web distinction
- **Maintainable**: Tests organized by business domain with clear API/Web separation

### 📦 **Complete MVP Coverage**
- **All essential features**: Auth, User, Content, Chat, Payments, Health with API + Web
- **Core workflows**: API-first approach ensures reliable backend before UI development
- **Platform viability**: All components needed for functioning creator platform
- **Ready for scale**: Structure supports AI and Workers apps when needed

## Integration Test Scope - API-First MVP

### ✅ **What API Integration Tests Cover**
- Multiple controllers working in sequence within same domain
- Service layer + database operations + data transformations
- API endpoint validation + request/response handling
- Authentication and authorization middleware chains
- Business logic workflows within domain boundaries
- External service integration (Stripe, media processing) - mocked

### ✅ **What Web Integration Tests Cover**
- Frontend components + API integration + state management
- Form validation + error handling + user feedback
- Real-time UI updates + optimistic updates + loading states
- Component interaction patterns within domain
- UI state management + local storage + auth state
- Browser API usage + file handling + WebSocket connections

### ❌ **What Integration Tests Don't Cover**
- Cross-app communication (E2E handles this)
- Real browser interactions across multiple pages (E2E handles this)
- Actual external API calls (mocked in integration tests)
- Complete user journeys across multiple apps (E2E handles this)
- Advanced real-time features across apps (E2E handles this)
- Performance testing across multiple apps (E2E handles this)

## Relationship to E2E Testing - API-First MVP

```typescript
// Development Flow:
Unit Tests → API Integration Tests → Web Integration Tests → E2E Tests

// Example: Essential Creator Journey - API-First MVP
1. Unit: ValidationService.test.ts (email validation)
2. API Integration: auth-flow.api.test.ts (register + login API flow)
3. Web Integration: auth-flow.web.test.ts (auth forms + UI state)
4. API Integration: profile-lifecycle.api.test.ts (profile API operations)
5. Web Integration: profile-lifecycle.web.test.ts (profile forms + UI)
6. API Integration: media-upload.api.test.ts (content upload API)
7. Web Integration: media-upload.web.test.ts (upload forms + progress UI)
8. API Integration: payment-basic.api.test.ts (payment API processing)
9. Web Integration: payment-basic.web.test.ts (payment forms + Stripe UI)
10. E2E: operations/mvpCreatorJourney.ts (complete cross-app user journey)
```

Integration tests provide the **essential API-first middle layer** for MVP - validating backend APIs work correctly before building UI, then testing frontend integrations work with validated APIs, creating a reliable foundation for cross-app E2E testing of complete user journeys.