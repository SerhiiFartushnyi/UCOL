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

const email = process.env.EMAIL1;
const password = process.env.PASSWORD1;

test('New Design Button Expanding Options', async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    // Check if the user is logged in
    await page.waitForSelector('#profile-toggler');
    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible();
    await profileIcon.click();

    // Click on Project Button
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('link', { name: 'Go to Projects' }).click();
    
    // New Design Button Expanding Options
    await page.waitForSelector('#add-new-project-btn');
    await expect(page.locator('#add-new-project-btn')).toBeVisible({ timeout: 10000 });
    await page.locator('#add-new-project-btn').hover();

    await expect(page.locator('#projects-context-menu')).toContainText('Start a new project');
    await expect(page.locator('#promptToDesignModal')).toContainText('Prompt-to-Design');
});
