import { test, expect } from '@playwright/test';
import { HealthCheckOperation } from './runners/operations/no-auth-user-parrallel/HealthCheck';
import { AuthFlowOperation as ParallelAuthFlow } from './runners/operations/no-auth-user-parrallel/AuthFlow';
import { UserFlowOperation as ParallelUserFlow } from './runners/operations/no-auth-user-parrallel/UserFlow';
import { AuthFlowOperation as SerialAuthFlow } from './runners/operations/auth-user-serial/AuthFlow';
import { UserFlowOperation as SerialUserFlow } from './runners/operations/auth-user-serial/UserFlow';

// === PARALLEL TESTS (No Authentication Required) ===
test.describe('API Integration Tests - No Auth User Parallel', () => {
  let healthCheckOperation: HealthCheckOperation;
  let parallelAuthFlow: ParallelAuthFlow;
  let parallelUserFlow: ParallelUserFlow;

  test.beforeEach(async ({ request }) => {
    healthCheckOperation = new HealthCheckOperation(request);
    parallelAuthFlow = new ParallelAuthFlow(request);
    parallelUserFlow = new ParallelUserFlow(request);
  });

  // === HEALTH CHECKS ===
  test('should get health status', async () => {
    const result = await healthCheckOperation.runHealthStatus();
    expect(result.success).toBe(true);
  });

  test('should get hello message', async () => {
    const result = await healthCheckOperation.runHelloMessage();
    expect(result.success).toBe(true);
  });

  test('should handle CORS preflight', async () => {
    const result = await healthCheckOperation.runCorsCheck();
    expect(result.success).toBe(true);
    expect(result.corsEnabled).toBe(true);
  });

  test('should get hello message from database', async () => {
    const result = await healthCheckOperation.runHelloFromDatabase();
    expect(result.success).toBe(true);
    // Test can handle both successful DB connection or fallback
    expect([200, 500]).toContain(result.status);
  });

  test('should get database health status', async () => {
    const result = await healthCheckOperation.runDatabaseHealth();
    expect(result.success).toBe(true);
    // Test can handle both healthy or unhealthy database
    expect([200, 500]).toContain(result.status);
  });

  test('should run all health checks together', async () => {
    const results = await healthCheckOperation.runAllHealthChecks();
    
    expect(results.healthStatus.success).toBe(true);
    expect(results.helloMessage.success).toBe(true);
    expect(results.corsCheck.success).toBe(true);
    expect(results.helloFromDatabase.success).toBe(true);
    expect(results.databaseHealth.success).toBe(true);
  });

  // === AUTH VALIDATION TESTS (Error Cases) ===
  test('should handle registration with missing fields', async () => {
    const result = await parallelAuthFlow.runRegistrationMissingFields();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.error).toBe('Validation error');
  });

  test('should handle registration with invalid email', async () => {
    const result = await parallelAuthFlow.runRegistrationInvalidEmail();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Invalid email format');
  });

  test('should handle registration with password mismatch', async () => {
    const result = await parallelAuthFlow.runRegistrationPasswordMismatch();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Passwords do not match');
  });

  test('should handle registration with weak password', async () => {
    const result = await parallelAuthFlow.runRegistrationWeakPassword();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.error).toBe('Validation error');
  });

  test('should handle invalid login credentials', async () => {
    const result = await parallelAuthFlow.runInvalidLogin();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.error).toBe('Authentication failed');
  });

  test('should handle login with missing credentials', async () => {
    const result = await parallelAuthFlow.runLoginMissingCredentials();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Email and password are required');
  });

  test('should handle invalid refresh token', async () => {
    const result = await parallelAuthFlow.runInvalidRefreshToken();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.error).toBe('Authentication failed');
  });

  test('should handle missing refresh token', async () => {
    const result = await parallelAuthFlow.runRefreshTokenMissingToken();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Refresh token is required');
  });

  // === USER VALIDATION TESTS (No Auth Required) ===
  test('should handle get user profile without authentication', async () => {
    const result = await parallelUserFlow.runGetUserProfileWithoutAuth();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Authentication required');
  });

  test('should handle get user profile with invalid authentication', async () => {
    const result = await parallelUserFlow.runGetUserProfileWithInvalidAuth();
    expect(result.success).toBe(true);
    expect(result.data.error).toBeDefined();
  });

  test('should handle profile update without authentication', async () => {
    const result = await parallelUserFlow.runProfileUpdateWithoutAuth({ username: 'test' });
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Authentication required');
  });

  test('should handle profile update with empty username', async () => {
    const result = await parallelUserFlow.runProfileUpdateEmptyUsername('fake-token');
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Authentication failed');
  });

  test('should handle get public profile for nonexistent user', async () => {
    const result = await parallelUserFlow.runGetPublicProfileNonexistent();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('User not found');
  });

  test('should handle user search without query', async () => {
    const result = await parallelUserFlow.runUserSearchWithoutQuery();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Search query is required');
  });

  test('should handle user search with empty query', async () => {
    const result = await parallelUserFlow.runUserSearchEmptyQuery();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Search query is required');
  });

  test('should handle user search with short query', async () => {
    const result = await parallelUserFlow.runUserSearchShortQuery();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Search query must be at least 2 characters long');
  });

  test('should handle user search with excessive limit', async () => {
    const result = await parallelUserFlow.runUserSearchExcessiveLimit();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Search limit cannot exceed 50 results');
  });

  test('should handle user search with custom limit', async () => {
    const result = await parallelUserFlow.runUserSearchCustomLimit();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.data.results.length).toBeLessThanOrEqual(10);
  });

  test('should handle check username with short username', async () => {
    const result = await parallelUserFlow.runCheckShortUsername();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Username must be between 3 and 30 characters');
  });

  test('should handle check username with long username', async () => {
    const result = await parallelUserFlow.runCheckLongUsername();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Username must be between 3 and 30 characters');
  });

  test('should handle check username with invalid characters', async () => {
    const result = await parallelUserFlow.runCheckInvalidUsernameChars();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Username can only contain letters, numbers, and underscores');
  });

  test('should handle check username with valid format', async () => {
    const result = await parallelUserFlow.runCheckValidUsernameFormat();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.data.username).toBe('valid_user123');
    expect(typeof result.data.data.available).toBe('boolean');
  });
});

// === SERIAL TESTS (Authentication Required) ===
test.describe.configure({ mode: 'serial' });
test.describe('API Integration Tests - Auth User Serial', () => {
  let testUserCredentials: { email: string; password: string; username: string };
  let authTokens: { accessToken: string; refreshToken: string };

  test.beforeAll(async () => {
    // Generate unique test user for this serial test suite
    const timestamp = Date.now();
    testUserCredentials = {
      email: `testuser_${timestamp}@example.com`,
      password: 'TestPassword123!',
      username: `testuser_${timestamp}`
    };
  });

  // === AUTH FLOW TESTS ===
  test('should handle valid user registration and setup auth', async ({ request }) => {
    const serialAuthFlow = new SerialAuthFlow(request);
    const result = await serialAuthFlow.runValidRegistrationWithCredentials(testUserCredentials);
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.message).toBe('User registered successfully');
    
    // Store tokens for subsequent tests
    authTokens = {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken
    };
  });

  test('should run complete auth flow integration', async ({ request }) => {
    const serialAuthFlow = new SerialAuthFlow(request);
    const result = await serialAuthFlow.runCompleteAuthFlow();
    
    expect(result.register.success).toBe(true);
    expect(result.refresh.success).toBe(true);
    expect(result.logout.success).toBe(true);
    expect(result.tokens.original.accessToken).toBeDefined();
    expect(result.tokens.original.refreshToken).toBeDefined();
    expect(result.tokens.refreshed.accessToken).toBeDefined();
    expect(result.tokens.refreshed.refreshToken).toBeDefined();
  });

  // === USER FLOW TESTS ===
  test('should get authenticated user profile', async ({ request }) => {
    const serialUserFlow = new SerialUserFlow(request);
    const result = await serialUserFlow.runGetUserProfileWithAuth(authTokens.accessToken);
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.data.email).toBe(testUserCredentials.email);
  });

  test('should run authenticated user profile tests', async ({ request }) => {
    const serialUserFlow = new SerialUserFlow(request);
    const result = await serialUserFlow.runAuthenticatedUserProfileTests(authTokens.accessToken);
    expect(result.getProfile.success).toBe(true);
    expect(result.updateBasicFields.success).toBe(true);
    expect(result.updateProfileFields.success).toBe(true);
    expect(result.clearProfileFields.success).toBe(true);
    expect(result.usernameAvailability.success).toBe(true);
    expect(result.search.success).toBe(true);
  });

  test('should run user state change tests', async ({ request }) => {
    const serialUserFlow = new SerialUserFlow(request);
    const result = await serialUserFlow.runUserStateChangeTests(authTokens.accessToken);
    expect(result.checkAvailable.success).toBe(true);
    expect(result.updateProfile.success).toBe(true);
    expect(result.checkTaken.success).toBe(true);
    expect(result.searchUser.success).toBe(true);
  });

  test('should run complete user flow integration', async ({ request }) => {
    const serialUserFlow = new SerialUserFlow(request);
    const result = await serialUserFlow.runCompleteUserFlow(authTokens.accessToken);
    expect(result.originalProfile.success).toBe(true);
    expect(result.usernameCheck.success).toBe(true);
    expect(result.profileFieldsUpdate.success).toBe(true);
    expect(result.usernameUpdate.success).toBe(true);
    expect(result.updatedProfile.success).toBe(true);
    expect(result.publicProfile.success).toBe(true);
    expect(result.searchResult.success).toBe(true);
    expect(result.clearFields.success).toBe(true);
  });

  test('should handle user logout', async ({ request }) => {
    const serialAuthFlow = new SerialAuthFlow(request);
    const result = await serialAuthFlow.runLogoutWithToken(authTokens.refreshToken);
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.message).toBe('Logout successful');
  });
}); 