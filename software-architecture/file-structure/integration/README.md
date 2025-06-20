
## Integration vs E2E: Different Patterns for Different Purposes

### 🔧 **Integration Testing: Within-App Component Interaction**
```typescript
// Location: integration/{app}/{domain}/
// Purpose: Test multiple components within same app working together
// Pattern: Descriptive test names, app-separated folders
// Tool: Vitest (fast, no browser, Node.js environment)

// API Integration Example:
integration/api/auth/auth-flow.integration.test.ts
// Tests: LoginController + ValidationService + AuthService + Database
// Validates: Business logic, data flow, error handling within auth domain
// Scope: Backend components working together

// Web Integration Example:  
integration/web/auth/auth-components.integration.test.ts
// Tests: LoginForm + AuthContext + API client + State management
// Validates: Component interaction, state updates, UI data flow
// Scope: Frontend components working together
```

### 🎭 **E2E Testing: Cross-App User Flows**  
```typescript
// Location: e2e/runners/{domain}/{action}/
// Purpose: Test complete user journeys across multiple apps
// Pattern: .api.ts/.web.ts (same feature, different app perspectives)
// Tool: Playwright (real browser, full environment)

e2e/runners/auth/login/login.api.ts + login.web.ts
// Tests: Full user login flow from UI to database
// Validates: Real browser interactions, actual API calls, user experience
// Scope: Cross-app workflows (web → api interaction)
```

## Why Different Patterns?

### **Integration: Different Components, Same App**
```typescript
// These test DIFFERENT functionality within SAME app
integration/api/auth/
├── auth-flow.integration.test.ts        # Controllers + Services + Models
├── validation-service.integration.test.ts # Service layer interaction
└── middleware.integration.test.ts       # Middleware + JWT + Database

integration/web/auth/
├── auth-components.integration.test.ts  # Form + Context + Hooks
├── auth-state.integration.test.ts       # State + API + Persistence
└── auth-routing.integration.test.ts     # Routes + Guards + Navigation
```

### **E2E: Same Feature, Different Apps**
```typescript
// These test SAME functionality from different app perspectives
e2e/runners/auth/login/
├── login.api.ts    # Backend: Tests /api/auth/login endpoint
└── login.web.ts    # Frontend: Tests login UI that calls that endpoint
```

## API Integration Testing Patterns

### **Multi-Controller Flow Testing**
```typescript
// integration/api/auth/auth-flow.integration.test.ts
describe('Authentication Flow Integration', () => {
  test('complete registration to login to refresh flow', async () => {
    // Test RegisterController + LoginController + RefreshTokenController
    // + ValidationService + AuthService + Database working together
    
    const registerResult = await registerController.handle(registerRequest);
    expect(registerResult.success).toBe(true);
    
    const loginResult = await loginController.handle(loginRequest);
    expect(loginResult.token).toBeDefined();
    expect(loginResult.user.id).toBe(registerResult.user.id);
    
    const refreshResult = await refreshController.handle(loginResult.refreshToken);
    expect(refreshResult.accessToken).toBeDefined();
  });
});
```

### **Service Layer Integration**
```typescript
// integration/api/user/unified-model.integration.test.ts  
describe('User Model Integration', () => {
  test('user creation with profile setup and search', async () => {
    // Test createUser + updateProfile + findUserById + searchUsers working together
    const user = await createUser(userData);
    const profile = await updateProfile(user.id, profileData);
    const retrieved = await findUserById(user.id);
    const searchResults = await searchUsers(profile.username);
    
    expect(retrieved.profile).toEqual(profile);
    expect(searchResults).toContainEqual(expect.objectContaining({ id: user.id }));
  });
});
```

### **Database + Service Integration**
```typescript
// integration/api/auth/validation-service.integration.test.ts
describe('Validation Service Integration', () => {
  test('validation with auth service and database constraints', async () => {
    // Test ValidationService + AuthService + Database constraints working together
    const validationResult = await validationService.validateRegistration(userData);
    const authResult = await authService.createUser(validationResult.data);
    const dbUser = await findUserByEmail(userData.email);
    
    expect(authResult.user.email).toBe(dbUser.email);
    expect(dbUser.createdAt).toBeDefined();
  });
});
```

## Web Integration Testing Patterns

### **Component + State + API Integration**
```typescript
// integration/web/auth/auth-components.integration.test.ts
describe('Authentication Components Integration', () => {
  test('login form to authenticated state to protected content', async () => {
    render(<App />, { wrapper: AuthProvider });
    
    // Test LoginForm + AuthContext + API client + ProtectedRoute working together
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    // Verify state updates, API calls, and UI changes work together
    await waitFor(() => {
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
```

### **Multi-Component UI Flow**
```typescript
// integration/web/user/profile-components.integration.test.ts
describe('Profile Management Integration', () => {
  test('profile view to edit to save to update flow', async () => {
    render(<ProfilePage />, { wrapper: UserProvider });
    
    // Test ProfileView + ProfileForm + UserContext + API client working together
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));
    await user.type(screen.getByLabelText('Name'), 'New Name');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    
    await waitFor(() => {
      expect(screen.getByText('New Name')).toBeInTheDocument();
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });
});
```

### **State Management Integration**
```typescript
// integration/web/auth/auth-state.integration.test.ts
describe('Authentication State Integration', () => {
  test('auth state persistence and API synchronization', async () => {
    // Test AuthContext + useAuth hook + localStorage + API client working together
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    // Verify state, persistence, and API calls work together
    expect(result.current.user).toBeDefined();
    expect(localStorage.getItem('authToken')).toBeTruthy();
    expect(mockApiClient.login).toHaveBeenCalled();
  });
});
```

## Root-Level Testing Commands

### **Comprehensive Integration Testing**
```bash
# All integration tests (both apps)
npm run test:integration

# App-specific integration
npm run test:integration:api        # All API component integration tests
npm run test:integration:web        # All web component integration tests

# Domain-specific integration (both apps)
npm run test:integration:auth       # Auth integration in both API and web
npm run test:integration:user       # User integration in both API and web

# Specific integration test file
npm run test:integration -- "auth-flow"
npm run test:integration -- "profile-components"
```

### **Package.json Scripts**
```json
{
  "scripts": {
    "test:unit": "npm run test:unit:api && npm run test:unit:web",
    "test:integration": "cd integration && npm test",
    "test:integration:api": "cd integration && npm test api/",
    "test:integration:web": "cd integration && npm test web/",
    "test:integration:auth": "cd integration && npm test --testNamePattern='auth'",
    "test:integration:user": "cd integration && npm test --testNamePattern='user'",
    "test:e2e": "cd e2e && npm test",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

### **CI/CD Pipeline Integration**
```yaml
# Example CI pipeline
test-unit:
  - cd apps/api && npm run test
  - cd apps/web && npm run test

test-integration:
  - npm run test:integration:api    # API component integration
  - npm run test:integration:web    # Web component integration

test-e2e:
  - npm run test:e2e:api           # Cross-app API testing
  - npm run test:e2e:web           # Cross-app web testing
```

## Benefits of Root-Level Integration Structure

### 🎯 **Strategic Visibility**
- **First-class citizen**: Integration testing has prominent root-level location
- **TDD importance**: Easy to discover and prioritize integration testing
- **Full landscape view**: See complete integration coverage at a glance
- **AI-friendly**: Clear, predictable location for integration tests

### ⚡ **Workflow Benefits**
```bash
# Simple, memorable commands
cd integration && npm test                    # All integration tests
cd integration && npm test api/auth           # Specific app + domain
cd integration && npm test --grep "profile"   # Cross-app domain testing

# Compare to buried approach:
cd apps/api && npm test --testNamePattern="integration"  # Complex
cd apps/web && npm test --testNamePattern="integration"  # Fragmented
```

### 🚀 **Cross-App Integration Insights**
```typescript
// Root structure makes integration coverage obvious
integration/
├── api/auth/        # Backend auth component integration
├── web/auth/        # Frontend auth component integration
└── shared/auth/     # Future: shared auth utilities integration
```

### 🔧 **Centralized Management**
- **Single config**: One `vitest.config.ts` for all integration tests
- **Shared utilities**: Common fixtures, helpers, setup in `shared/`
- **Consistent patterns**: All integration tests follow same structure
- **Easy maintenance**: Single location for integration test strategy

## Integration Test Scope by App

### ✅ **API Integration Tests Cover**
- Multiple controllers working in sequence
- Service layer + database operations together
- Data transformation across API components
- Error handling between API components
- Business logic workflows within API domain
- Middleware + authentication + authorization flows

### ✅ **Web Integration Tests Cover**
- Multiple components working together
- State management + UI updates + persistence
- Component + context + hooks interaction
- Form handling + validation + submission flows
- API client + component + state integration
- Routing + navigation + auth guard flows

### ❌ **What Integration Tests Don't Cover (E2E Handles This)**
- Cross-app communication (web → api)
- Real browser interactions (actual clicks, navigation)
- Complete user journeys across apps
- Real network requests between apps
- Full environment testing

## Testing Layer Hierarchy

```typescript
// Clear testing progression with distinct locations:
1. Unit Tests (apps/*/src/*/__tests__/)     # Single component behavior
2. Integration Tests (integration/)          # Multi-component within app  
3. E2E Tests (e2e/)                         # Cross-app user flows

// Each layer has distinct:
Location:   Local __tests__/  →  Root integration/  →  Root e2e/
Purpose:    Single component →  Multi-component     →  User journey
Tools:      Vitest           →  Vitest              →  Playwright
Scope:      Isolated         →  Within-app          →  Cross-app
```

## Relationship to E2E Testing

```typescript
// Testing progression example: User Authentication
1. Unit: ValidationService.test.ts (single service behavior)
2. Integration: auth-flow.integration.test.ts (controllers + services + database)  
3. E2E: runners/auth/login/login.api.ts + login.web.ts (full user journey)

// API App Testing Flow:
Unit: LoginController.test.ts → Integration: auth-flow.integration.test.ts → E2E: login.api.ts

// Web App Testing Flow:  
Unit: LoginForm.test.ts → Integration: auth-components.integration.test.ts → E2E: login.web.ts

// Cross-App Testing Flow:
Integration: Both apps test internal components → E2E: Full user journey across apps
```

## Development Workflow

### **TDD with Integration Tests**
```bash
# 1. Write failing unit test (TDD Red phase)
cd apps/api && npm test "LoginController.test.ts"  # Should fail

# 2. Implement feature (TDD Green phase)  
cd apps/api && npm test "LoginController.test.ts"  # Should pass

# 3. Test component integration (Integration phase)
npm run test:integration:auth  # Test components working together

# 4. Test complete user flow (E2E phase)
npm run test:e2e:api          # API endpoint testing
npm run test:e2e:web          # Web UI testing
```

### **Feature Development Flow**
```bash
# New feature: User profile management
1. Unit tests: ProfileController.test.ts, ProfileForm.test.ts
2. Integration: profile-management.integration.test.ts, profile-components.integration.test.ts  
3. E2E: runners/user/profile/profile.api.ts, profile.web.ts
```

This root-level integration architecture provides **strategic visibility, workflow efficiency, and clear separation of concerns** while maintaining the distinction from E2E testing patterns.
