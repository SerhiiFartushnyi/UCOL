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

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

test('User Profile is opened ',async ({ page }) => {
    test.slow();
    
    //Login
    await login(page, email, password);
    
    // Navigate to site  
    await page.goto('/');

    // Check if the user is logged in
    //await page.waitForLoadState('networkidle');
    await page.waitForSelector('#profile-toggler-container');
    const profile = page.locator('#profile-toggler-container');
    await expect(profile).toBeVisible({timeout: 10000});
    await profile.click();

    // Check Profile Popup 
    await page.waitForSelector('#profile-container');
    const profilePopup = page.locator('#profile-container');
    await expect(profilePopup).toBeVisible({timeout: 10000});
    await expect(profilePopup).toContainText(email);
    await expect(profilePopup).toContainText('Sign Out');
});