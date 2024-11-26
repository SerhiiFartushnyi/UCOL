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
const firstName = process.env.FIRST_NAME1;
const lastName = process.env.LAST_NAME1;

test.beforeEach(async ({ page }) => {
    
    await page.goto('/');
    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    // Used the saved email from the config file
    await page.getByPlaceholder('enter your e-mail address').fill(email);
    await page.getByRole('button', { name: 'Log in' }).click();
    const passField = await page.getByPlaceholder('8 char. +1 symbol, number,') 
    await passField.click();
    await passField.fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
});

test('Profile popup', async ({ page }) => {

    // Check if the user is logged in
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
            await page.waitForLoadState('networkidle');
     } 

    await page.waitForSelector('#profile-toggler-container');
    const profileIcon = page.locator('#profile-toggler-container');
    await page.waitForSelector('#profile-toggler-container');
    await expect(profileIcon).toBeVisible({ timeout: 10000 });
    await profileIcon.click();

    // Check Profile information
    await page.waitForSelector('#profile-container');
    const profile =  page.locator('#profile-container');
    await expect(profile).toBeVisible();
    await expect(profile).toContainText(firstName +' ' +lastName);
    await expect(profile).toContainText(email);

    // Check text in Popup Window 
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();
});