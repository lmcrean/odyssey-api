import fs from 'fs';
import path from 'path';

/**
 * Operation: Capture screenshot
 */
export async function captureScreenshot(page, testName, screenshotName, fullPage = false) {
  const screenshotDir = path.join('playwright', 'screenshots', 'production', testName);

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log(`📸 Capturing ${fullPage ? 'full page' : 'viewport'} screenshot: ${screenshotName}`);
  
  if (fullPage) {
    await page.setViewportSize({ width: 1280, height: 800 });
  } else {
    await page.setViewportSize({ width: 375, height: 667 });
  }
  
  await page.waitForLoadState('networkidle');
  
  const fileName = `${fullPage ? 'desktop-' : 'mobile-'}${screenshotName}.png`;
  await page.screenshot({
    path: path.join(screenshotDir, fileName),
    fullPage: fullPage
  });

  if (fullPage) {
    await page.setViewportSize({ width: 375, height: 667 });
  }
}

/**
 * Operation: Capture error screenshot
 */
export async function captureErrorScreenshot(page, testName, errorContext) {
  const timestamp = Date.now();
  await captureScreenshot(page, testName, `error-${errorContext}-${timestamp}`);
} 