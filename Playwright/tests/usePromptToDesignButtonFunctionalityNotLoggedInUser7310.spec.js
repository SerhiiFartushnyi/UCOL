import { test, expect } from '@playwright/test';

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

test('Use Prompt To Design Not logged in User', async ({ page }) => {

    await page.goto('/generative-ai/');

    await expect(page.locator('#promptToDesignContainer').getByText('What would you like to')).toBeVisible();
    await expect(page.locator('#promptToDesignFormTop').getByRole('button', { name: 'use prompt to design' })).toBeVisible();

    await page.locator('#promptToDesignPurposeInputTop').click();
    await page.locator('#promptToDesignPurposeInputTop').fill('Design instagrem post about Running');
    await page.locator('#promptToDesignPurposeInputTop').press("Enter");

    // Check Popup Modal Text 
    await expect(page.locator('#auth-modal-content')).toContainText('Sign up');
    await expect(page.locator('#auth-modal-content')).toContainText('Have an account? Log in');

});