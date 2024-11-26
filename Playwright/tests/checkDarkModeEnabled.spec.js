import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Enable Dark Mode and Check
test('Enable Dark mode and Check', async ({ page }) => {
    test.slow();

    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible({ timeout: 10000 });

    //await page.waitForLoadState('networkidle')
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    // Check if the profile icon is visible
    await page.waitForSelector('#profile-toggler');
    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible({ timeout: 10000 });
    await profileIcon.click();

    await page.locator('#profile-container label span').click();

    // Check if the Dark Mode is enabled
    const isDarkModeEnabled = await page.evaluate(() => {
        const htmlElement = document.getElementById('dark-class-place');
        return htmlElement && htmlElement.classList.contains('dark');
    });

    // Log the result
    console.log('Dark mode enabled:', isDarkModeEnabled);

    // Assert that dark mode is enabled
    expect(isDarkModeEnabled).toBe(true);

    await expect(page.getByRole('link', { name: 'start designing now' })).toBeVisible({ timeout: 10000 });
});