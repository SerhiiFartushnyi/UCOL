import { test, expect } from '@playwright/test';

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

// Sign Up Button Functionality
test ('Sign Up button', async ({ page }) => {

    await page.goto('/');

    // Visual Test Main Page
    await expect(page.getByText('Design professional')).toBeVisible();
    //locate the sign up button and click 
    const signUpButton = page.getByText('sign up');
    await expect(signUpButton).toBeVisible();
    await signUpButton.click();

    // Visual Test Sign Modal
    const signUpPopup = page.locator('#auth-modal-content');
    expect(signUpPopup).toBeVisible();
    await expect(signUpPopup).toContainText('Sign up');
    await expect(page.getByRole('button', { name: 'continue with Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(page.getByText('Have an account? Log in')).toBeVisible();
});