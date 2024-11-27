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

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

test('Project Button Functionality', async ({ page }) => {
    test.slow();
   
    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible({ timeout: 10000 });

    await page.waitForSelector('#create-template');
     await page.locator('#create-template').click();

    //Assertions to check if the user is on the correct page
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#editableTitle');
    await expect(page.locator('#editableTitle')).toContainText('New Design');
    await expect(page.getByLabel('Editor canvas')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Projects' }).click();

    //Assertions to check if the user is on redirected to Projects page
    await expect(page.getByRole('heading')).toContainText('Projects');
    page.url().includes('projects');

});