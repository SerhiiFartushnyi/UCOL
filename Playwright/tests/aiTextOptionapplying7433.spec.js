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

//AI Text Options Applying

test ('AI Text Options Applying', async ({ page }) => {
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

    // Assertion of AI Page
    await expect(page.locator('section').filter({ hasText: 'Write your text with A.I.' })).toBeVisible();
    await expect(page.getByPlaceholder('What do you want to write')).toBeVisible();
    await expect(page.getByText('What are you writing for?')).toBeVisible();
    await expect (page.locator('#generate-btn')).toBeDisabled();

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

    // // Check if specific options are available
    // const expectedOptions = ['Body', 'Free-form', 'Headline']; // Add all expected options here
    // expectedOptions.forEach(option => {
    // if (options.includes(option)) {
    //     console.log(`Option "${option}" is available.`);
    // } else {
    //     console.log(`Option "${option}" is NOT available.`);
    // }
    // });

    // Assertion of Footer buttons
    await expect(page.locator('#tab-container').getByRole('button', { name: 'GENERATE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HISTORY' })).toBeVisible();

    //Assertion of AI Page Functionality 
    await page.getByPlaceholder('What do you want to write').click();
    await page.getByPlaceholder('What do you want to write').fill(text);
    await expect (page.locator('#generate-btn')).toBeEnabled();
    await page.locator('#generate-btn').click();

    page.waitForLoadState('networkidle');

    // Assertion if Page has changed to  Rephrase Panel
    await expect(page.locator('section').filter({ hasText: 'Rephrase' })).toBeVisible();

});