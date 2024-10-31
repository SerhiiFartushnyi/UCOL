import { test, expect } from '@playwright/test';
import config from './config';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Format Options Applying
test('Format Options Applying', async ({ page }) => {

    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill(mail);

    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    await page.waitForLoadState('networkidle');

     //Click on the create template button
     const startDesigning = page.locator('#create-template')
     await expect(startDesigning).toBeVisible();
     await startDesigning.click();

     const templateButton = page.getByRole('button', { name: 'Templates' })
     await expect(templateButton).toBeVisible();
     await templateButton.click();

     // Assertion of Templete Page 

     await expect(page.locator('section').filter({ hasText: 'Library' })).toBeVisible();
     await expect(page.getByPlaceholder('Search …')).toBeVisible();
     await expect(page.locator('#asset-library-content')).toBeVisible();

});
