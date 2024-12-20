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


// Free To Use Button
test('Free to use button', async ({ page }) => {

    await page.goto('/features/format-extender/');

    // Find the text 'FREE-to-use' and scroll to it
    const textLocator = page.getByText('FREE-to-use');
    await textLocator.scrollIntoViewIfNeeded();

    // Click on the 'Try for free' button
    await page.getByText('try for free').click();
    
    // Check Login Text
    await expect(page.getByText('log in to start creating')).toBeVisible({ timeout: 10000 });

});

// Free To Use Button
test('Get Pro button', async ({ page }) => {

    await page.goto('/features/format-extender/');

    //Find the text 'PRO' and scroll to it
    const textLocator = page.getByText('PRO', { exact: true })
    await textLocator.scrollIntoViewIfNeeded();

    //Click on the 'Get Pro' button
    await page.getByText('get pro').click();

    // Check Login Text
    await expect(page.getByText('log in to start creating')).toBeVisible({ timeout: 10000 });

});


