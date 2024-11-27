import { test, expect } from '@playwright/test';

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

test('Use Prompt To Design Not logged in User', async ({ page }) => {

    await page.goto('/generative-ai/');

    await expect(page.locator('#promptToDesignContainer').getByText('What would you like to')).toBeVisible();

    await expect(page.locator('#promptToDesignFormTop').getByRole('button', { name: 'use prompt to design' })).toBeVisible();

    const promptPopup = page.locator('#promptToDesignPurposeInputTop');
    await promptPopup.click();
    await promptPopup.fill('Design instagrem post about Running');
    await promptPopup.press("Enter");

    // Check Popup Modal Text 
    const loginPopup = page.locator('#auth-modal-content');
    await expect(loginPopup).toBeVisible();
    await expect(loginPopup).toContainText('Sign up');
    await expect(loginPopup).toContainText('Have an account? Log in');
});