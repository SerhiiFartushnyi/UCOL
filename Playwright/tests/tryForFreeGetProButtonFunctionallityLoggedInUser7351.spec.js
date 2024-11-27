import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

});

// Free To Use Button
test('Free to use button', async ({ page }) => {

    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    // Find the text 'FREE-to-use' and scroll to it
    const textLocator = page.getByText('FREE-to-use');
    await textLocator.scrollIntoViewIfNeeded();

    // Click on the 'Try for free' button
    await page.getByRole('link', { name: 'try for free' }).click();

    // Check Page Text
    await expect(page.getByText('my projects')).toBeVisible();

    // Check URL
    expect(page.url()).toContain('/studio/');

});

// Free To Use Button
test('Get Pro button', async ({ page }) => {

    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    //Find the text 'PRO' and scroll to it
    const textLocator = page.getByText('PRO', { exact: true })
    await textLocator.scrollIntoViewIfNeeded();

    //Click on the 'Get Pro' button
    await page.getByRole('link', { name: 'get pro' }).click();

    // Check Page Text
    await expect(page.getByText('my projects')).toBeVisible();

    // Check URL
    expect(page.url()).toContain('/studio/');

});
