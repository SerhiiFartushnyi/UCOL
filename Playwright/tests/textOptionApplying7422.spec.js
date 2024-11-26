import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Text Options Applying
test('Text Options Applying', async ({ page }) => {
    test.slow();
    
    //Login
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
    await expect(startDesigning).toBeVisible({ timeout: 10000 });
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    const textButton = page.getByRole('button', { name: 'Text', exact: true })
    await expect(textButton).toBeVisible({ timeout: 10000 });

    await textButton.click();

    // Assertion of Text Page
    await expect(page.locator('section').filter({ hasText: 'Text' })).toBeVisible({timeout:10000 });
    await expect(page.locator('#asset-library-content')).toBeVisible({timeout:10000 });
    
    const noOfTexts = page.locator('#asset-library-content div');
    const numberOfTexts = await noOfTexts.count();

    const randomTextIndex = Math.floor(Math.random() * numberOfTexts); 
    await page.waitForTimeout(1000); // wait for text formats to load 
    await noOfTexts.nth(randomTextIndex).click();
    
    console.log(`Clicked on text at index: ${randomTextIndex}`);

    //Click on X button to close the Text panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('#asset-library-content')).not.toBeVisible();

    // await page.getByLabel('Undo').click();
});