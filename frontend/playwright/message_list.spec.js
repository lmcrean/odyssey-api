const { test, expect, devices } = require('@playwright/test');

// Use an iPhone 12 viewport
const iPhone12 = devices['iPhone 12'];

test.describe('Message list tests', () => {
    test('Message list loads correctly after sign in on mobile', async ({ page, request }) => {
        await page.setViewportSize(iPhone12.viewport);

        // 1. Perform sign in
        const signInResponse = await request.post('https://odyssey-api-f3455553b29d.herokuapp.com/dj-rest-auth/login/', {
            data: {
                username: 'user',
                password: 'qwerqwer*'
            }
        });

        expect(signInResponse.ok()).toBeTruthy();
        const responseBody = await signInResponse.json();
        const accessToken = responseBody.access_token;
        const refreshToken = responseBody.refresh_token;

        // 2. Set tokens in localStorage
        await page.goto('https://3000-lmcrean-momentsclone2-chab47zjuwx.ws.codeinstitute-ide.net');
        await page.evaluate(({ accessToken, refreshToken }) => {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        }, { accessToken, refreshToken });

        // 3. Verify tokens are set correctly
        const storedAccessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
        const storedRefreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
        expect(storedAccessToken).toBe(accessToken);
        expect(storedRefreshToken).toBe(refreshToken);

        // 4. Verify token validity with a test request
        const testResponse = await request.get('https://odyssey-api-f3455553b29d.herokuapp.com/dj-rest-auth/user/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        expect(testResponse.ok()).toBeTruthy();

        // 5. Navigate to messages page
        await page.goto('https://3000-lmcrean-momentsclone2-chab47zjuwx.ws.codeinstitute-ide.net/messages');
        
        // 6. Wait for content to load
        await page.waitForSelector('h2:has-text("Your Messages")', { timeout: 60000 });

        // 7. Check for messages or "No messages found"
        const messageOrNoMessage = await page.waitForSelector('[data-testid="message-item"], [data-testid="no-messages-found"]', { timeout: 30000 });
        expect(messageOrNoMessage).toBeTruthy();

        // 8. Take a screenshot
        await page.screenshot({ path: 'screenshots/messages-page-mobile.png', fullPage: true });

        // 9. Verify content
        const messages = await page.locator('[data-testid="message-item"]').all();
        if (messages.length > 0) {
            for (const message of messages) {
                await expect(message.locator('img')).toBeVisible();
                await expect(message.locator('.MessageUsername')).toBeVisible();
                await expect(message.locator('.LastMessage')).toBeVisible();
                await expect(message.locator('.LastMessageTime')).toBeVisible();
            }
        } else {
            const noMessagesFound = await page.locator('[data-testid="no-messages-found"]');
            await expect(noMessagesFound).toBeVisible();
        }
    });
});