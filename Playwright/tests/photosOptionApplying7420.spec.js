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

// Photos Options Applying
test('Photos Options Applying', async ({ page }) => {
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
    const photosButton = page.getByRole('button', { name: 'Photos', exact: true })

    await expect(photosButton).toBeVisible({ timeout: 10000 });
    await photosButton.click({ timeout: 1000 });

    // Assertion of Photos Page
    await expect(page.locator('section').filter({ hasText: 'Photos' })).toBeVisible({ timeout:10000 });
    await expect(page.locator('#asset-library-content')).toBeVisible({ timeout:10000 });

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#asset-library-content button');
    const noOfPhotos = page.locator('#asset-library-content button')
    const numberOfPhotos = await noOfPhotos.count();

    console.log(`Number of images: ${numberOfPhotos}`);

    //Click on random image
    const randomPhotoIndex = Math.floor(Math.random() * numberOfPhotos);
    await noOfPhotos.nth(randomPhotoIndex).click();

    console.log(`Clicked on image at index: ${randomPhotoIndex}`);

    // Remove wirst randomly  the selected photo
    await page.getByLabel('Undo').click();

    //Search for not existing photo
    const photosSearch = page.getByPlaceholder('Search …')
    await photosSearch.click();
    await photosSearch.fill('064dridjwl');
    await photosSearch.press('Enter');
    await photosSearch.clear();

    // Search for a existing format 
    const photosNames = ['man', 'flower', 'bookr', 'ocean', 'water', 'ball', 'moon', 'car', 'audi', 'horror', 'birthday'];

    const randomName = photosNames[Math.floor(Math.random() * photosNames.length)]
    
//     // Chose a random picture based on provided requests

    await photosSearch.click();
    await photosSearch.fill(randomName);
    await photosSearch.press('Enter');
    console.log(`Searching for ${randomName} picture`);
    
   // Get the count of photos  after the search
   await page.waitForSelector('#asset-library-content button');
   const noOfPhotos2 = page.locator('#asset-library-content button')

    const numberOfPhotos2 = await noOfPhotos2.count();
    console.log(`Number of images: ${numberOfPhotos2}`);

    // Click on random image
    const randomPhotoIndex2 = Math.floor(Math.random() * numberOfPhotos2);
    await noOfPhotos2.nth(randomPhotoIndex2).click();
    console.log(`Clicked on image at index: ${randomPhotoIndex2}`);

    // //Click on X button to close the Formats panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Photos' })).not.toBeVisible();

    //await page.getByLabel('Undo').click();
});