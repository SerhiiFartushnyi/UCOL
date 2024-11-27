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

// Learn Page Logged in User
test('Learn Page Logged in User', async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);
    
    // Navigate to site  
    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    await page.getByRole('link', { name: 'learn' }).click();
    await expect(page.locator('body')).toContainText('coolab.ai // blog');

    const url = page.url();
    await expect(url).toBe('https://blog.coolab.ai/'); 

});

test('Learn Page NOT Logged in User', async ({ page }) => {

    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    await page.getByRole('link', { name: 'learn' }).click();
    await expect(page.locator('body')).toContainText('coolab.ai // blog');

    const url = page.url();
    await expect(url).toBe('https://blog.coolab.ai/'); 

});