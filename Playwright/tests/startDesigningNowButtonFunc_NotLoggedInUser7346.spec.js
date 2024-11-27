import { test, expect } from '@playwright/test';

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

// 'Start designing now' button functionality (not logged in User)
test('Start designing now button functionality (not logged in User', async ({ page }) => {
    test.slow();
    await page.goto('/features/format-extender/');
    //await page.pause();

    // Check if the 'Start designing now' button is present
    await expect(page.locator('#create-template')).toContainText('start designing');

    // Click the 'Start now' button
    await expect(page.getByText('start now').first()).toBeVisible();
    await page.getByText('start now').first().click();

    // Check Login Text
    await expect(page.getByText('log in to start creating')).toBeVisible({ timeout: 10000 });

});


