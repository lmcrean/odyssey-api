import fs from 'fs';
import path from 'path';
import { expect } from '@playwright/test';

export const baseURL = 'localhost:8080';

export async function login(page) {
  console.log('Logging in...');
  await page.goto(`${baseURL}/signin`);
  console.log('Navigated to signin page');

  console.log('Filling in login form...');
  await page.fill('input[name="username"]', 'newuser8941');
  await page.fill('input[name="password"]', 'strongpassword123');

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation(),
  ]);

  console.log('Login attempted');
  const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
  console.log(accessToken ? 'Access token found in localStorage' : 'Warning: No access token found in localStorage');
}

export async function captureScreenshot(page, testName, pageName, fullPage = false) {
  const screenshotDir = path.join('playwright', 'screenshots', 'alerts', testName);

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log(`Capturing screenshot for ${fullPage ? 'full page' : 'mobile view'} of ${pageName}`);
  
  if (fullPage) {
    // For full page, use a larger viewport
    await page.setViewportSize({ width: 1280, height: 800 });
  } else {
    // For mobile view, use the original mobile viewport size
    await page.setViewportSize({ width: 375, height: 667 });
  }
  
  await page.waitForLoadState('networkidle');
  
  const fileName = `${fullPage ? 'full-' : 'mobile-'}${pageName}.png`;
  await page.screenshot({
    path: path.join(screenshotDir, fileName),
    fullPage: fullPage
  });

  // Reset to mobile view after capturing full page screenshot
  if (fullPage) {
    await page.setViewportSize({ width: 375, height: 667 });
  }
}

export async function handleTestVideo(testInfo) {
  console.log('Handling test video...');
  console.log('Test status:', testInfo.status);
  
  // Wait for the video to be ready
  await testInfo.attachments.find(attachment => attachment.name === 'video');
  console.log('Video attachment found:', testInfo.attachments.find(attachment => attachment.name === 'video'));

  const videoAttachment = testInfo.attachments.find(attachment => attachment.name === 'video');
  console.log('Video attachment:', videoAttachment);
  if (videoAttachment) {
    const videoPath = videoAttachment.path;
    console.log('Video path:', videoPath);
    
    if (videoPath) {
      const videoDir = path.join('playwright', 'videos', testInfo.title);
      const newPath = path.join(videoDir, `${testInfo.title}.webm`);
      
      // Ensure the directory exists
      fs.mkdirSync(videoDir, { recursive: true });

      // Wait for the video file to be fully written
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Move the video file
      fs.renameSync(videoPath, newPath);
      console.log(`Video saved to: ${newPath}`);
    } else {
      console.log('Video path is undefined.');
    }
  } else {
    console.log('No video attachment found for this test.');
  }
}

export async function handleFailedTestVideo(testInfo) {
  if (testInfo.status !== testInfo.expectedStatus) {
    await handleTestVideo(testInfo);
  }
}

// Production testing utilities

/**
 * Runner: Generate unique test user for production testing
 */
export function generateProductionTestUser() {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return {
    username: `e2euser${timestamp}${randomSuffix}`,
    password: `TestPass${randomSuffix}123!`
  };
}

/**
 * Operation: Wait for production deployment to be ready
 */
export async function waitForProductionReady(page, frontendUrl, maxRetries = 5) {
  console.log('⏳ Waiting for production deployment to be ready...');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.goto(frontendUrl, { timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      console.log('✅ Production deployment is ready');
      return;
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/${maxRetries} failed, retrying...`);
      if (i === maxRetries - 1) {
        throw new Error(`Production deployment not ready after ${maxRetries} attempts: ${error}`);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

/**
 * Operation: Execute with retry logic for production network conditions
 */
export async function executeWithRetry(operation, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}