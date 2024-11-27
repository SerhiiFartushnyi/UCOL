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

//Layers Tab Opening 
test ('Layers Tab Opening', async ({ page }) => {
    test.slow();
   
    // Login
    await login(page, email, password);
    
    // Navigate to site  
    await page.goto('/');
    //Assertions to check if the user is logged in
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    // page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    // Go To Scene Tab
    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    await page.getByRole('link', { name: 'start now' }).first().click();

    // Accertion to check if the layers tab is opened
    await page.locator('#layers').click();
    await expect(page.locator('.genre-assets-topbar--title')).toContainText('layers');
});