import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state

test.use({ storageState: 'auth.json' });

test ('Sign Up Button Functionallity ', async ({ page }) => {
    await page.goto('/');
    //Check buttons
    await expect(page.locator('#profile')).toContainText('log in');
    await expect(page.locator('#profile')).toContainText('sign up');
    await page.getByText('sign up').click();

    // Check Popup Modal Text 
    await expect(page.locator('#auth-modal-content')).toContainText('Sign up');
    await expect(page.locator('#auth-modal-content')).toContainText('Have an account? Log in');
    
    //Check Sign In Popup Modal Screenshot
    //await expect(page.locator('#auth-modal-content')).toHaveScreenshot('signUpButtonPopup.png');

    await page.close();
    
     


});
