import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail1;
const password = config.password1;

// Format Extender Button
test('Format Extender Button', async ({ page }) => {
    test.slow();
    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill(mail);

    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    // Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    await page.waitForLoadState('networkidle');
    await page.locator('#profile-toggler-container').click();
    await page.getByRole('link', { name: 'Go to Projects' }).click();
    
    // Click on Format Extender Button
    await page.locator('#ui-id-2').click();
    // Check if the Format Extender page is loaded
    await page.getByRole('button', { name: 'extend format' }).click();
    await expect(page.locator('#format-extender')).toContainText('Format Extender');
    await expect(page.locator('#format-extender')).toContainText('see your projects or extend an existing one');
});