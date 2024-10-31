import { test, expect } from '@playwright/test';
const config = require('./config');

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });


// Free To Use Button
test('Free to use button', async ({ page }) => {

    await page.goto('/features/format-extender/');

    // Find the text 'FREE-to-use' and scroll to it
    const textLocator = page.getByText('FREE-to-use');
    await textLocator.scrollIntoViewIfNeeded();

    // Click on the 'Try for free' button
    await page.getByRole('link', { name: 'try for free' }).click();

    // Check Login Text
    await expect(page.getByText('log in to start creating')).toBeVisible();
    // Check URL
    expect(page.url()).toContain('/log-in/');

});

// Free To Use Button
test('Get Pro button', async ({ page }) => {

    await page.goto('/features/format-extender/');

    //Find the text 'PRO' and scroll to it
    const textLocator = page.getByText('PRO', { exact: true })
    await textLocator.scrollIntoViewIfNeeded();

    //Click on the 'Get Pro' button
    await page.getByRole('link', { name: 'get pro' }).click();

    // Check Login Text
    await expect(page.getByText('log in to start creating')).toBeVisible();
    // Check URL
    expect(page.url()).toContain('/log-in/');

});


