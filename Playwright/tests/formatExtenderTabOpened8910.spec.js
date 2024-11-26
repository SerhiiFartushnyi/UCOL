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

//Format Extender Tab Opening 
test ('Format Extender Tab Opening', async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);
    
    // Navigate to site  
    await page.goto('/');

    //Assertions to check if the user is logged in
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    // Go To Scene Tab >> Format Extender
    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    await page.getByRole('link', { name: 'start now' }).first().click();
    
    //await page.goto('/tool/studio/');

    await expect(page.getByRole('heading', { name: 'format extender' })).toBeVisible();
    await expect(page.getByText('Select one of your projects')).toBeVisible();

    // Click another tab and than check if Format extender button is working 
    await page.locator('#re-gen').click();
    await page.locator('#format-extender').click();
    await expect(page.getByRole('heading', { name: 'format extender' })).toBeVisible();
});