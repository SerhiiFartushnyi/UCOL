import { test, expect } from '@playwright/test';
import config from './config';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Teext Options Applying
test('Text Options Applying', async ({ page }) => {
    test.slow();
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

    await page.waitForLoadState('networkidle');
    const textButton = page.getByRole('button', { name: 'Text', exact: true })

    await expect(textButton).toBeVisible();
    await textButton.click({ timeout: 1000 });

    // Assertion of Photos Page
    await expect(page.locator('section').filter({ hasText: 'Text' })).toBeVisible();
    await expect(page.locator('#asset-library-content')).toBeVisible();
    
    const noOfTexts = page.locator('#asset-library-content div');
    const numberOfTexts = await noOfTexts.count();
    const randomTextIndex = Math.floor(Math.random() * numberOfTexts);
    await noOfTexts.nth(randomTextIndex).click();
    
    console.log(`Clicked on text at index: ${randomTextIndex}`);
});