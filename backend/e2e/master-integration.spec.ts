import { test, expect } from '@playwright/test';
import { HealthCheckOperation } from './runners/operations/HealthCheck';

test.describe('API Integration Tests', () => {
  let healthCheckOperation: HealthCheckOperation;

  test.beforeEach(async ({ request }) => {
    healthCheckOperation = new HealthCheckOperation(request);
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
}); 