import { test, expect } from '@playwright/test';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

// Not registered user flow
test('Not Registerd User Flow', async ({ page }) => {

    // Clcik on Design Button
    await page.goto('/');
    // await page.locator('#dropdown-toggler a:has-text("design")').click();

    // const textElement1 = await page.getByText('log in to start creating');
    // await expect(textElement1).toContainText('log in to start creating');

    // Click on Start Designing Buttonon Header
    await page.goto('/')
    await page.locator('#create-template').click();

    const textElement2 = await page.getByText('log in to start creating');
    await expect(textElement2).toContainText('log in to start creating');

 // Click on Start Designing Now Button
    await page.goto('/');
    await page.getByRole('link', { name: 'start designing now' }).click();

    const textElement3 = await page.getByText('log in to start creating');
    await expect(textElement3).toContainText('log in to start creating');
  
});