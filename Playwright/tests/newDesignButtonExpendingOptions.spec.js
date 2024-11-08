import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail1;
let password = config.password1;

test('New Design Button Expanding Options', async ({ page }) => {

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
    await expect(page.getByRole('img', { name: 'Avatar profile' })).toBeVisible();

    await page.waitForLoadState('networkidle');
    await page.getByRole('img', { name: 'Avatar profile' }).click();

    // Click on Project Button
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();
    await page.getByRole('link', { name: 'Go to Projects' }).click();
    
    // New Design Button Expanding Options
    await expect(page.locator('#add-new-project-btn')).toBeVisible();
    await page.locator('#add-new-project-btn').hover();

    await expect(page.locator('#projects-context-menu')).toContainText('Start a new project');
    await expect(page.locator('#promptToDesignModal')).toContainText('Prompt-to-Design');
});
