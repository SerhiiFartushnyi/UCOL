import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL1;
const password = process.env.PASSWORD1;

// Format Extender Button
test('Format Extender Button', async ({ page }) => {
    test.slow();

    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    // Check if the user is logged in

    //await page.waitForLoadState('networkidle');
    // Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
 } 
    await page.locator('#profile-toggler-container').click();
    await page.getByRole('link', { name: 'Go to Projects' }).click();
    
    // Click on Format Extender Button
    await page.locator('#ui-id-2').click();
    // Check if the Format Extender page is loaded
    await page.getByRole('button', { name: 'extend format' }).click();
    await expect(page.locator('#format-extender')).toContainText('Format Extender');
    await expect(page.locator('#format-extender')).toContainText('see your projects or extend an existing one');
});