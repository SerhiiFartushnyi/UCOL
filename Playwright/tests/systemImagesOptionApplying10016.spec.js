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

// System Images Options Applying
test('System Images Options Applying', async ({ page }) => {
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
    await expect(startDesigning).toBeVisible({ timeout: 10000 });
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    const imagesButton = page.getByRole('button', { name: 'System Images', exact: true })
//    await imagesButton.click();

    await expect(imagesButton).toBeVisible({ timeout: 10000 });
    await imagesButton.click({ timeout: 1000 });

    // Assertion of Formats Page 
    //await expect(page.locator('section').filter({ hasText: 'Library' })).toBeVisible();
    await expect(page.locator('#asset-library-content')).toBeVisible({ timeout: 10000 });

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#asset-library-content button');
    const imageButton = page.locator('#asset-library-content button')
    const numberOfImages = await imageButton.count();
    console.log(`Number of images: ${numberOfImages}`);

    // Click on randon image
    const randomImageIndex = Math.floor(Math.random() * numberOfImages);
    //await imageButton.nth(randomImageIndex).click(); hardcoded becaus there are only 2 images
    await imageButton.nth(0).click();

    console.log(`Clicked on image at index: ${randomImageIndex}`);

    //Search for a template Not existing Search request
    
    const searchButton = page.getByPlaceholder('Search …');
    await searchButton.click();
    await searchButton.fill('064dridjwl');
    await searchButton.press('Enter');

    await expect(page.getByText('No Elements')).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder('Search …').clear();

    // //Click on X button to close the Formats panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Library' })).not.toBeVisible();
});