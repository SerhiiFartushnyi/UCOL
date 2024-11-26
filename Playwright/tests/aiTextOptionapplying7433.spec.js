import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFORE RUNNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const text = process.env.REPHRASE_TEXT;

//AI Text Options Applying
test('AI Text Options Applying', async ({ page }) => {
    test.slow();
    
    // Log in
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    //Click on the create template button
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible();
    await startDesigning.click();

    const textButton = page.getByRole('button', { name: 'A.I. Text', exact: true })

    await expect(textButton).toBeVisible({timeout: 10000 });
    await textButton.click({ timeout: 1000 });

    // Assertion of AI Page
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await expect(page.locator('section').filter({ hasText: 'Write your text with A.I.' })).toBeVisible({timeout:10000 });
    await expect(page.getByPlaceholder('What do you want to write')).toBeVisible({timeout: 10000 });
    await expect(page.getByText('What are you writing for?')).toBeVisible({timeout: 10000 });
    await expect(page.locator('#generate-btn')).toBeDisabled();

    // Locate the select element
    const selectElement = page.locator('#writing-for');

    // Extract the options
    const options = await selectElement.locator('option').allTextContents();

    // Log the options
    console.log('Available options:', options);

    const expectedOptions = ['Body', 'Free-form', 'Headline']; // Add all expected options here
    expectedOptions.forEach(option => {
        expect(options).toContain(option, `Option "${option}" should be available.`);
    });

    // Assertion of Footer buttons
    await expect(page.locator('#tab-container').getByRole('button', { name: 'GENERATE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HISTORY' })).toBeVisible();

    //Assertion of AI Page Functionality 
    const textArea = page.getByPlaceholder('What do you want to write');
    await textArea.click();
    await textArea.fill(text);

    const genButton = page.locator('#generate-btn');
    await expect(genButton).toBeEnabled();
    await genButton.click();
    
    //page.waitForLoadState('networkidle');

    // Assertion if Page has changed to  Rephrase Panel
    await expect(page.locator('section').filter({ hasText: 'Rephrase' })).toBeVisible({timeout: 10000 });
});