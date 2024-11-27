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

//  Templaye page opening
test('Template tab Opening', async ({ page }) => {
    test.slow();
    
    //Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    //Assertions to check if the user is logged in

    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible({ timeout: 10000 });

    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible({ timeout: 10000 });
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible();
    expect(page.url()).toContain('/templates/');

});

test('Template tab Opening NOT LOgged in User', async ({ page }) => {

    await page.goto('/');

    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible();
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible({ timeout: 10000 });
    expect(page.url()).toContain('/templates/');

});

