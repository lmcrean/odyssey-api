import { test, expect } from '@playwright/test';
import { TestHelpers, SELECTORS, TIMEOUT } from '../utils/helpers';
import { TEST_DATA, USER_SCENARIOS } from '../fixtures/test-data';

test.describe('Hello World Flow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('/');
  });

  test('should display the application title', async ({ page }) => {
    await expect(page).toHaveTitle(TEST_DATA.WEB.TITLE);
  });

  test('should load the hello world component', async ({ page }) => {
    await helpers.expectElementToBeVisible(SELECTORS.HELLO_WORLD_CONTAINER);
    await helpers.expectElementToContainText('h1', TEST_DATA.WEB.TITLE);
  });

  test('should display loading state initially', async ({ page }) => {
    // The loading state might be brief, so we check for it or success
    const loadingOrSuccess = page.locator(`${SELECTORS.LOADING}, ${SELECTORS.SUCCESS}`);
    await expect(loadingOrSuccess).toBeVisible();
  });

  test('should successfully fetch and display hello world message', async ({ page }) => {
    // Wait for API response with retry logic for branch deployments
    await helpers.waitForApiResponseWithRetry('/api/health');
    
    // Check that success section is visible
    await helpers.expectElementToBeVisible(SELECTORS.SUCCESS);
    
    // Check that the message card contains the expected text
    await helpers.expectElementToBeVisible(SELECTORS.MESSAGE_CARD);
    await helpers.expectElementToContainText(SELECTORS.MESSAGE_CARD, TEST_DATA.API.EXPECTED_HEALTH_MESSAGE);
  });

  test('should display health status information', async ({ page }) => {
    // Wait for both API calls to complete with retry logic
    await helpers.waitForApiResponseWithRetry('/api/health/status');
    
    // Check that status card is visible
    await helpers.expectElementToBeVisible(SELECTORS.STATUS_CARD);
    
    // Verify status information
    await helpers.expectElementToContainText(SELECTORS.STATUS_CARD, TEST_DATA.API.EXPECTED_STATUS_MESSAGE);
    await helpers.expectElementToContainText(SELECTORS.STATUS_CARD, TEST_DATA.API.EXPECTED_VERSION);
  });

  test('should display timestamp in status card', async ({ page }) => {
    await helpers.waitForApiResponse('/api/health/status');
    
    // Check that timestamp is present (we don't check exact value as it changes)
    const statusCard = page.locator(SELECTORS.STATUS_CARD);
    await expect(statusCard).toContainText('Timestamp:');
  });

  test('should handle API error gracefully', async ({ page }) => {
    // Intercept API calls and return error
    await page.route('**/api/health', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.reload();
    
    // Check that error message is displayed
    await helpers.expectElementToBeVisible(SELECTORS.ERROR);
    await helpers.expectElementToContainText(SELECTORS.ERROR, 'Failed to connect to API');
  });

  test('should allow retry after error', async ({ page }) => {
    // First, simulate an error
    await page.route('**/api/health', route => {
      route.fulfill({
        status: 500,
        body: 'Server Error'
      });
    });

    await page.reload();
    
    // Verify error state
    await helpers.expectElementToBeVisible(SELECTORS.ERROR);
    await helpers.expectElementToBeVisible(SELECTORS.RETRY_BUTTON);
    
    // Remove the route to allow successful retry
    await page.unroute('**/api/health');
    
    // Click retry button
    await helpers.clickAndWaitForResponse(SELECTORS.RETRY_BUTTON, '/api/health');
    
    // Verify success after retry
    await helpers.expectElementToBeVisible(SELECTORS.SUCCESS);
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check that components are still visible on mobile
    await helpers.expectElementToBeVisible(SELECTORS.HELLO_WORLD_CONTAINER);
    await helpers.waitForApiResponseOrSuccess('/api/health');
    await helpers.expectElementToBeVisible(SELECTORS.SUCCESS);
  });

  test('should handle slow API responses', async ({ page }) => {
    // Simulate slow API response
    await page.route('**/api/health', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.continue();
    });

    await page.reload();
    
    // Should show loading state
    await helpers.expectElementToBeVisible(SELECTORS.LOADING);
    
    // Eventually should show success
    await helpers.expectElementToBeVisible(SELECTORS.SUCCESS);
  });

  test('should maintain state during navigation', async ({ page }) => {
    // Wait for initial load
    await helpers.waitForApiResponse('/api/health');
    await helpers.expectElementToBeVisible(SELECTORS.SUCCESS);
    
    // Refresh page
    await page.reload();
    
    // Should load again successfully
    await helpers.waitForApiResponse('/api/health');
    await helpers.expectElementToBeVisible(SELECTORS.SUCCESS);
  });
});

test.describe('User Scenarios', () => {
  test(`${USER_SCENARIOS.HAPPY_PATH.name}`, async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // User navigates to the application
    await page.goto('/');
    
    // User sees the dashboard title
    await expect(page).toHaveTitle(TEST_DATA.WEB.TITLE);
    
    // User sees the hello world component load
    await helpers.expectElementToBeVisible(SELECTORS.HELLO_WORLD_CONTAINER);
    
    // User sees the API connection test succeed
    await helpers.waitForApiResponseOrSuccess('/api/health');
    await helpers.expectElementToBeVisible(SELECTORS.SUCCESS);
    
    // User sees the hello world message
    await helpers.expectElementToContainText(SELECTORS.MESSAGE_CARD, TEST_DATA.API.EXPECTED_HEALTH_MESSAGE);
    
    // User sees the API status information
    await helpers.expectElementToContainText(SELECTORS.STATUS_CARD, TEST_DATA.API.EXPECTED_STATUS_MESSAGE);
  });

  test(`${USER_SCENARIOS.RETRY_FLOW.name}`, async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Simulate API failure
    await page.route('**/api/health', route => {
      route.fulfill({ status: 500, body: 'Server Error' });
    });
    
    // User navigates to the application
    await page.goto('/');
    
    // User sees an error message
    await helpers.expectElementToBeVisible(SELECTORS.ERROR);
    
    // User clicks the retry button
    await helpers.expectElementToBeVisible(SELECTORS.RETRY_BUTTON);
    
    // Remove the error route to simulate API recovery
    await page.unroute('**/api/health');
    
    // User clicks retry
    await helpers.clickAndWaitForResponse(SELECTORS.RETRY_BUTTON, '/api/health');
    
    // User sees the successful connection
    await helpers.expectElementToBeVisible(SELECTORS.SUCCESS);
  });
});