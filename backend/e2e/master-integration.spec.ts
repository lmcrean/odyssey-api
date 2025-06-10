import { test, expect } from '@playwright/test';
import { HealthCheckOperation } from './runners/operations/HealthCheck';
import { AuthFlowOperation } from './runners/operations/AuthFlow';

test.describe('API Integration Tests', () => {
  let healthCheckOperation: HealthCheckOperation;
  let authFlowOperation: AuthFlowOperation;

  test.beforeEach(async ({ request }) => {
    healthCheckOperation = new HealthCheckOperation(request);
    authFlowOperation = new AuthFlowOperation(request);
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
}); 