import { test, expect } from '@playwright/test';
const config = require('./config');

/* 
//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail1;
const password = config.password1;
const firstName = config.firstName;
const lastName = config.lastName;

test.beforeEach(async ({ page }) => {
    
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

});

test('Profile popup', async ({ page }) => {

    // Check if the user is logged in
    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible();
    await profileIcon.click();

    // Check Profile information
    await expect(page.locator('#profile-container')).toContainText(firstName +' ' +lastName);
    await expect(page.locator('#profile-container')).toContainText(email);

    // Check text in Popup Window 
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();

});