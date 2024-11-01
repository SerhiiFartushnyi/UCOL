import { test, expect } from '@playwright/test';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

// 'Start designing now' button functionality (not logged in User)
test('Header >> Start designing now button functionality (not logged in User', async ({ page }) => {
    await page.goto('/');
        //await page.pause();

        // Check if the 'Start designing now' button is present
        await expect(page.locator('#create-template')).toContainText('start designing');

        await page.locator('#create-template').click();
        // Check Login Text
        await expect(page.getByText('log in to start creating')).toBeVisible();
        // Check URL > should click lig in button to check the URL
        // expect(page.url()).toContain('/log-in/');
});

test('Body .. Start designing now button functionality (not logged in User', async ({ page }) => {
    test.slow();
    await page.goto('/');
        

        // Check if the 'Start designing now' button is present

        await expect(page.locator('#create-template')).toBeVisible();
        await expect(page.getByText('start designing now')).toBeVisible();
        
        await page.getByText('start designing now').click();
       
        // Check Login Text
        await expect(page.getByText('log in to start creating')).toBeVisible();
        await expect(page.getByText('No account? Sign up')).toBeVisible();
        
});

