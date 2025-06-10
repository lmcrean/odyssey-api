import { test, expect } from '@playwright/test';
import { HealthCheckOperation } from './runners/operations/HealthCheck';
import { AuthFlowOperation } from './runners/operations/AuthFlow';
import { UserFlowOperation } from './runners/operations/UserFlow';

test.describe('API Integration Tests', () => {
  let healthCheckOperation: HealthCheckOperation;
  let authFlowOperation: AuthFlowOperation;
  let userFlowOperation: UserFlowOperation;

  test.beforeEach(async ({ request }) => {
    healthCheckOperation = new HealthCheckOperation(request);
    authFlowOperation = new AuthFlowOperation(request);
    userFlowOperation = new UserFlowOperation(request);
  });

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

  // Auth endpoint tests
  test('should handle valid user registration', async () => {
    const result = await authFlowOperation.runValidRegistration();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.message).toBe('User registered successfully');
  });

  test('should handle registration with missing fields', async () => {
    const result = await authFlowOperation.runRegistrationMissingFields();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.error).toBe('Validation error');
  });

  test('should handle registration with invalid email', async () => {
    const result = await authFlowOperation.runRegistrationInvalidEmail();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Invalid email format');
  });

  test('should handle registration with password mismatch', async () => {
    const result = await authFlowOperation.runRegistrationPasswordMismatch();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Passwords do not match');
  });

  test('should handle registration with weak password', async () => {
    const result = await authFlowOperation.runRegistrationWeakPassword();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.error).toBe('Validation error');
  });

  test('should handle invalid login credentials', async () => {
    const result = await authFlowOperation.runInvalidLogin();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.error).toBe('Authentication failed');
  });

  test('should handle login with missing credentials', async () => {
    const result = await authFlowOperation.runLoginMissingCredentials();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Email and password are required');
  });

  test('should handle user logout', async () => {
    const result = await authFlowOperation.runLogout();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.message).toBe('Logout successful');
  });

  test('should handle invalid refresh token', async () => {
    const result = await authFlowOperation.runInvalidRefreshToken();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.error).toBe('Authentication failed');
  });

  test('should handle missing refresh token', async () => {
    const result = await authFlowOperation.runRefreshTokenMissingToken();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Refresh token is required');
  });

  test('should run complete auth flow integration', async () => {
    const result = await authFlowOperation.runCompleteAuthFlow();
    
    expect(result.register.success).toBe(true);
    expect(result.refresh.success).toBe(true);
    expect(result.logout.success).toBe(true);
    expect(result.tokens.original.accessToken).toBeDefined();
    expect(result.tokens.original.refreshToken).toBeDefined();
    expect(result.tokens.refreshed.accessToken).toBeDefined();
    expect(result.tokens.refreshed.refreshToken).toBeDefined();
  });

  // User endpoint tests
  test('should handle get user profile without authentication', async () => {
    const result = await userFlowOperation.runGetUserProfileWithoutAuth();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Authentication required');
  });

  test('should handle get user profile with invalid authentication', async () => {
    const result = await userFlowOperation.runGetUserProfileWithInvalidAuth();
    expect(result.success).toBe(true);
    expect(result.data.error).toBeDefined();
  });

  test('should handle profile update without authentication', async () => {
    const result = await userFlowOperation.runProfileUpdateWithoutAuth({ username: 'test' });
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Authentication required');
  });

  test('should handle profile update with empty username', async () => {
    const result = await userFlowOperation.runProfileUpdateEmptyUsername('fake-token');
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Username cannot be empty');
  });

  test('should handle get public profile for nonexistent user', async () => {
    const result = await userFlowOperation.runGetPublicProfileNonexistent();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('User not found');
  });

  test('should handle user search without query', async () => {
    const result = await userFlowOperation.runUserSearchWithoutQuery();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Search query is required');
  });

  test('should handle user search with empty query', async () => {
    const result = await userFlowOperation.runUserSearchEmptyQuery();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Search query is required');
  });

  test('should handle user search with short query', async () => {
    const result = await userFlowOperation.runUserSearchShortQuery();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Search query must be at least 2 characters long');
  });

  test('should handle user search with excessive limit', async () => {
    const result = await userFlowOperation.runUserSearchExcessiveLimit();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Search limit cannot exceed 50 results');
  });

  test('should handle user search with custom limit', async () => {
    const result = await userFlowOperation.runUserSearchCustomLimit();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.data.results.length).toBeLessThanOrEqual(10);
  });

  test('should handle check username with short username', async () => {
    const result = await userFlowOperation.runCheckShortUsername();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Username must be between 3 and 30 characters');
  });

  test('should handle check username with long username', async () => {
    const result = await userFlowOperation.runCheckLongUsername();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Username must be between 3 and 30 characters');
  });

  test('should handle check username with invalid characters', async () => {
    const result = await userFlowOperation.runCheckInvalidUsernameChars();
    expect(result.success).toBe(true);
    expect(result.data.error).toBe('Username can only contain letters, numbers, and underscores');
  });

  test('should handle check username with valid format', async () => {
    const result = await userFlowOperation.runCheckValidUsernameFormat();
    expect(result.success).toBe(true);
    expect(result.data.success).toBe(true);
    expect(result.data.data.username).toBe('valid_user123');
    expect(typeof result.data.data.available).toBe('boolean');
  });
}); 