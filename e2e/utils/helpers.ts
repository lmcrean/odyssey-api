import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForApiResponse(url: string, timeout = 30000) {
    try {
      const responsePromise = this.page.waitForResponse(
        response => response.url().includes(url) && response.status() === 200,
        { timeout }
      );
      return responsePromise;
    } catch (error) {
      // If waiting for response fails, try to wait for the UI to show success instead
      await this.page.waitForSelector('.success', { timeout: 5000 });
      return null;
    }
  }

  async waitForApiResponseWithRetry(url: string, maxRetries = 3, baseTimeout = 10000) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Progressive timeout: shorter attempts first, then longer ones
        const timeoutForAttempt = baseTimeout + (attempt * 10000);
        console.log(`Attempt ${attempt + 1}/${maxRetries} waiting for ${url} (timeout: ${timeoutForAttempt}ms)`);
        
        const responsePromise = this.page.waitForResponse(
          response => response.url().includes(url) && response.status() === 200,
          { timeout: timeoutForAttempt }
        );
        return await responsePromise;
      } catch (error) {
        console.log(`Attempt ${attempt + 1} failed for ${url}:`, error.message);
        
        if (attempt === maxRetries - 1) {
          // Last attempt failed, try fallback to UI state
          const successVisible = await this.page.locator('.success').isVisible();
          if (successVisible) {
            console.log(`API call failed but UI shows success state for ${url}`);
            return null;
          }
          throw error;
        }
        
        // Exponential backoff: wait before retry
        const backoffDelay = Math.min(2000 * Math.pow(2, attempt), 8000);
        console.log(`Waiting ${backoffDelay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }

  async waitForApiResponseOrSuccess(url: string, timeout = 30000) {
    try {
      // Race between API response and UI success state
      const result = await Promise.race([
        this.page.waitForResponse(
          response => response.url().includes(url) && response.status() === 200,
          { timeout }
        ),
        this.page.waitForSelector('.success', { timeout }).then(() => 'success')
      ]);
      return result;
    } catch (error) {
      // If both fail, check if we can see the success UI
      const successVisible = await this.page.locator('.success').isVisible();
      if (successVisible) {
        return 'success';
      }
      throw error;
    }
  }

  async expectElementToBeVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectElementToContainText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async clickAndWaitForResponse(selector: string, apiUrl: string) {
    const responsePromise = this.waitForApiResponse(apiUrl);
    await this.page.locator(selector).click();
    return responsePromise;
  }
}

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  HEALTH_STATUS: '/api/health/status'
};

export const SELECTORS = {
  LOADING: '.loading',
  ERROR: '.error',
  SUCCESS: '.success',
  HELLO_WORLD_CONTAINER: '.hello-world-container',
  MESSAGE_CARD: '.message-card',
  STATUS_CARD: '.status-card',
  RETRY_BUTTON: 'button:has-text("Retry")'
};

export const TIMEOUT = {
  DEFAULT: 30000,
  LONG: 45000,
  SHORT: 5000
};