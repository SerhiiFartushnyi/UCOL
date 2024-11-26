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

const email = process.env.EMAIL2;
const password = process.env.PASSWORD2;

test('Go to Scene Button Functionallity Empty Grid', async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    // Check if the user is logged in
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    await page.waitForSelector('#profile-toggler');
    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible({ timeout: 10000 });
    await profileIcon.click();

    // Click on Project Button
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('link', { name: 'Go to Projects' }).click();


    // User without projects should see the message
    await page.waitForSelector('#projects-tab-content');
    await expect(page.locator('#projects-tab-content')).toContainText('start a new project');

    // Click on Scene Button
    await page.getByRole('link', { name: 'go to scene' }).click()

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    
    await page.waitForSelector('#editableTitle');
    await expect(page.locator('#editableTitle')).toContainText('New Design');
    await expect(page.getByRole('button', { name: 'Templates' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'help Feedback' })).toBeVisible({ timeout: 10000 });
});