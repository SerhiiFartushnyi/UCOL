import { test, expect } from '@playwright/test';
import config from './config';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;
const text = config.rephraseText;

// Rephrase Options Applying

test ('Rephrase Options Applying', async ({ page }) => {
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
    const textButton = page.getByRole('button', { name: 'A.I. Text', exact: true })

    await expect(textButton).toBeVisible();
    await textButton.click({ timeout: 1000 });

    await expect(page.locator('section').filter({ hasText: 'Write your text with A.I.' })).toBeVisible();
    await expect(page.locator('#tab-container').getByRole('button', { name: 'GENERATE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HISTORY' })).toBeVisible();

    // Assertion of AI Page
    await page.getByPlaceholder('What do you want to write').click();
    await page.getByPlaceholder('What do you want to write').fill(text);
    await page.locator('#generate-btn').click();

    page.waitForLoadState('networkidle');

    const rewriteButton = page.getByRole('button', { name: 'REWRITE' });

    // Extend button click
    await page.getByText('Rewrite your text to elaborate').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible();

    // Shorten button click
    await page.getByText('Rewrite your text to be more concise').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible();

   //Rewrite button click
    await page.getByText('Rewrite your text in a different way').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible();
    
    
    // Click on X button to close Rephrase panel
    await page.locator('button[name="panel\\.close\\.\\/\\/ly\\.img\\.panel\\/assetLibrary"]').click();
    await expect(page.getByRole('heading', { name: 'Rephrase' })).not.toBeVisible();

    // Open the Rephrase panel again
    await textButton.click({ timeout: 1000 });

    // Click on History button
    await page.getByRole('button', { name: 'HISTORY' }).click();
    await expect(page.locator('.history-content')).toBeVisible();
    await page.getByLabel('Editor canvas').click();

    // Click on Generate button on Footer
    await page.locator('.tab-container button', {hasText: 'GENERATE'}).click();
    // Check if the Write your text with A.I. is visible
    await expect(page.getByRole('heading', { name: 'Write your text with A.I.' })).toBeVisible();

});