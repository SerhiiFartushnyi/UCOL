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

test('Go To Project Button ',async ({ page }) => {
    test.slow();

    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    // Check if the user is logged in
   
    const profileIcon = page.locator('#profile-toggler-container');
    await page.waitForSelector('#profile-toggler-container');
    await expect(profileIcon).toBeVisible();
    await profileIcon.click();

    // Check text in Popup Window 
    const goToProjects = await page.getByRole('link', { name: 'Go to Projects' });
    await expect(goToProjects).toBeVisible();
    await goToProjects.click();

    // Project Page assertions 
    await expect(page.getByRole('heading')).toContainText('Projects');
    expect (page.url()).toContain('/projects/');
});
