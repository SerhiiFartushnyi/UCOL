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

const email1 = process.env.EMAIL1;
const password1 = process.env.PASSWORD1;
const email2 = process.env.EMAIL2;
const password2 = process.env.PASSWORD2;

test('Start Designing User Without projects', async ({ page }) => {
    test.slow();

    //Login
    await login(page, email2, password2);
    
    // Navigate to site  
    await page.goto('/features/format-extender/');
    //await page.pause();

    // Check if the 'Start designing now' button is present
    await expect(page.locator('#create-template')).toContainText('start designing');

    // Click the 'Start now' button
    await expect(page.getByText('start now').first()).toBeVisible();
    await page.getByText('start now').first().click();

    expect(page.url()).toContain('/tool/studio');
});

test(' Start Designing User WITH projects', async ({ page }) => {

    test.slow();
    
    //Login
    await login(page, email1, password1);

    // Navigate to site  
    await page.goto('/features/format-extender/');
    //await page.pause();

    // Check if the 'Start designing now' button is present
    await expect(page.locator('#create-template')).toContainText('start designing');

    // Click the 'Start now' button
    await expect(page.getByText('start now').first()).toBeVisible();
    await page.getByText('start now').first().click();
    expect(page.url()).toContain('/tool/studio');

});