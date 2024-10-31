import { test, expect } from '@playwright/test';
const config = require('./config');

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

test('Brand Room Functionallity',async ({ page }) => {

    await page.goto('/');
    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    
    // Used the saved email from the config file
    await page.getByPlaceholder('enter your e-mail address').fill(config.mail1);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();  
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(config.password1);
    await page.getByRole('button', { name: 'Log in' }).click();

    await page.locator('#features-dropdown-toggler div').filter({ hasText: 'features' }).click();
    await page.locator('#brand-room-link').click();

    // Check if we are on the Brand Room Page
    await expect(page.locator('#brand-room-tabs')).toContainText('Brand Room');
    expect(page.url()).toContain('/projects/#brand-room');

});

