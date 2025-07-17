import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForApiResponse(url: string, timeout = 15000) {
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

  async waitForApiResponseOrSuccess(url: string, timeout = 15000) {
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
  DEFAULT: 10000,
  LONG: 30000,
  SHORT: 5000
};