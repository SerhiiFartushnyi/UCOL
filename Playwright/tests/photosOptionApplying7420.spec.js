import { test, expect } from '@playwright/test';
import config from './config';

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Photos Options Applying
test('Photos Options Applying', async ({ page }) => {
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
    const photosButton = page.getByRole('button', { name: 'Photos', exact: true })

    await expect(photosButton).toBeVisible();
    await photosButton.click({ timeout: 1000 });

    // Assertion of Photos Page
    await expect(page.locator('section').filter({ hasText: 'Photos' })).toBeVisible();
    await expect(page.locator('#asset-library-content')).toBeVisible();

    await page.waitForLoadState('networkidle');
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
    await page.getByPlaceholder('Search …').click();
    await page.getByPlaceholder('Search …').fill('064dridjwl');
    await page.getByPlaceholder('Search …').press('Enter');
    await page.getByPlaceholder('Search …').clear();

    // Search for a existing format 
    const photosNames = ['man', 'flower', 'bookr', 'ocean', 'water', 'ball', 'moon', 'car', 'audi', 'horror', 'birthday'];

    const randomName = photosNames[Math.floor(Math.random() * photosNames.length)]
    
//     // Chose a random picture based on provided requests 
    await page.getByPlaceholder('Search …').click();
    await page.getByPlaceholder('Search …').fill(randomName);
    await page.getByPlaceholder('Search …').press('Enter');
    console.log(`Searching for ${randomName} picture`);

    
   // Get the count of photos  after the search

   const noOfPhotos2 = page.locator('#asset-library-content button')

    const numberOfPhotos2 = await noOfPhotos2.count();
    console.log(`Number of images: ${numberOfPhotos2}`);

    // Click on random image
    const randomPhotoIndex2 = Math.floor(Math.random() * numberOfPhotos2);
    await noOfPhotos2.nth(randomPhotoIndex2).click();
    console.log(`Clicked on image at index: ${randomPhotoIndex2}`);

    // //Click on X button to close the Formats panel
    await page.locator('button[name="panel\\.close\\.\\/\\/ly\\.img\\.panel\\/assetLibrary"]').click();
    await expect(page.locator('section').filter({ hasText: 'Photos' })).not.toBeVisible();

    await page.getByLabel('Undo').click();
});