import { test, expect } from '@playwright/test';
const config = require('./config');

/* 
 // Define the flag to skip beforeEach for specific tests
 let skipBeforeEach = false;

//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
let password = config.password;

test('User Profile is opened ',async ({ page }) => {
    test.slow()
    await page.goto('/');
    
    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    // Used the saved email from the config file
    await page.getByPlaceholder('enter your e-mail address').fill(email);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    // Check if the user is logged in

    const profile = page.getByRole('img', { name: 'Avatar profile' })
    await expect(profile).toBeVisible();
    await profile.click();

    // Check Profile information

    await expect(page.locator('#profile-container')).toBeVisible();
    await expect(page.locator('#profile-container')).toContainText('Sign Out');

});