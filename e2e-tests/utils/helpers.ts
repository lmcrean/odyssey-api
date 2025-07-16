import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForApiResponse(url: string, timeout = 10000) {
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes(url) && response.status() === 200,
      { timeout }
    );
    return responsePromise;
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