import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const text = process.env.REPHRASE_TEXT;

// Rephrase Options Applying
test ('Rephrase Options Applying', async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    //Assertions to check if the user is logged in
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    //Click on the create template button
    await page.waitForSelector('#create-template');
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible();
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    const textButton = page.getByRole('button', { name: 'A.I. Text', exact: true })

    await expect(textButton).toBeVisible({ timeout: 10000 });
    await textButton.click({ timeout: 1000 });
    await page.waitForSelector('section');
    await expect(page.locator('section').filter({ hasText: 'Write your text with A.I.' })).toBeVisible({timeout:10000 });
    await expect(page.locator('#tab-container').getByRole('button', { name: 'GENERATE' })).toBeVisible({timeout:10000 });
    await expect(page.getByRole('button', { name: 'HISTORY' })).toBeVisible();

    // Assertion of AI Page
    const textField = page.getByPlaceholder('What do you want to write');
    await expect(textField).toBeVisible({timeout: 10000 });
    await textField.click();
    await textField.fill(text);
    await page.locator('#generate-btn').click();


    //page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    const rewriteButton = page.getByRole('button', { name: 'REWRITE' });

    // Extend button click
    await page.getByText('Rewrite your text to elaborate').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible({});

    // Shorten button click
    await page.getByText('Rewrite your text to be more concise').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible({});

   //Rewrite button click
    await page.getByText('Rewrite your text in a different way').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible({});
    
    
    // Click on X button to close Rephrase panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.getByRole('heading', { name: 'Rephrase' })).not.toBeVisible();

    // Open the Rephrase panel again
    await textButton.click({ timeout: 1000 });

    // Click on History button
    await page.getByRole('button', { name: 'HISTORY' }).click();
    await expect(page.locator('.history-content')).toBeVisible({});
    await page.getByLabel('Editor canvas').click();

    // Click on Generate button on Footer
    await page.locator('.tab-container button', {hasText: 'GENERATE'}).click();
    // Check if the Write your text with A.I. is visible
    await expect(page.getByRole('heading', { name: 'Write your text with A.I.' })).toBeVisible({});

});