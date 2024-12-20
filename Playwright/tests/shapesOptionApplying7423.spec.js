
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

// Shapes Options Applying
test('Shapes Options Applying', async ({ page }) => {
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
    await page.pause(1000);
    const photosButton = page.getByRole('button', { name: 'Shapes', exact: true })

    await expect(photosButton).toBeVisible({ timeout: 10000 });
    await photosButton.click({ timeout: 1000 });

    // Assertion of Shape Page
    await expect(page.locator('section').filter({ hasText: 'Shapes' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#asset-library-content')).toBeVisible({ timeout: 10000 });

    // await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
   
    await page.waitForSelector('#asset-library-content button');
    const noOfShapes= page.locator('#asset-library-content button')
    const numberOfShapes = await noOfShapes.count();

    console.log(`Number of shapes: ${numberOfShapes}`);

    //Click on random Shape
    const randomShapeIndex = Math.floor(Math.random() * numberOfShapes);
    await noOfShapes.nth(randomShapeIndex).click();

    console.log(`Clicked on shape at index: ${randomShapeIndex}`);

    // Check for error and retry if necessary
    const errorHeading = page.getByRole('heading', { name: 'Error Applying Asset' });

    if (await errorHeading.count() > 0 && await errorHeading.isVisible()) {
        const backButton = page.getByRole('button', { name: 'Back', exact: true });
        console.log('Error applying asset, retrying with another shape...');
        await backButton.click();
        const newRandomShapeIndex = Math.floor(Math.random() * numberOfShapes);
        await noOfShapes.nth(newRandomShapeIndex).click();
        console.log(`Clicked on shape at index: ${newRandomShapeIndex}`);
    }

    await expect(page.locator('#ubq-headline_label')).toContainText('Element');

    // Remove first randomly  selected Shape
    await page.getByLabel('Undo').click();

    //Search for not existing photo
    await page.getByPlaceholder('Search …').click();
    await page.getByPlaceholder('Search …').fill('064dridjwl');
    await page.getByPlaceholder('Search …').press('Enter');
    await page.getByPlaceholder('Search …').clear();

//     // Search for a existing Shape
 const shapesNames = ['star', 'arrow', 'circle', 'robot', 'rectangle','halfcircle'];
 const randomShape = shapesNames[Math.floor(Math.random() * shapesNames.length)]
    
   // Chose a random Shape based on provided requests 
   await page.getByPlaceholder('Search …').click();
  await page.getByPlaceholder('Search …').fill(randomShape);
   console.log(`Searching for ${randomShape} shape`);

   // Get the count of Shape after the search
   const noOfShapes2 = page.locator('#asset-library-content button')

    const numberOfShapes2 = await noOfShapes2.count();
    console.log(`Number of images: ${numberOfShapes2}`);

    // Click on random Shape
    const randomShapeIndex2 = Math.floor(Math.random() * numberOfShapes2);
    await noOfShapes2.nth(randomShapeIndex2).click();
    console.log(`Clicked on shape at index: ${randomShapeIndex2}`);

    // Check for error and retry if necessary
    const errorHeading2 = page.getByRole('heading', { name: 'Error Applying Asset' });

    if (await errorHeading2.count() > 0 && await errorHeading2.isVisible()) {
        const backButton2 = page.getByRole('button', { name: 'Back', exact: true });
        console.log('Error applying asset, retrying with another shape...');
        await backButton2.click();
        const newRandomShapeIndex2 = Math.floor(Math.random() * numberOfShapes2);
        await noOfShapes2.nth(newRandomShapeIndex2).click();
        console.log(`Clicked on shape at index: ${newRandomShapeIndex2}`);
    }
    // Check if the Shape is applied
    await expect(page.locator('#ubq-headline_label')).toContainText('Element');

    // Remove randomly selected Shape
    //await page.getByLabel('Undo').click();

    // //Click on X button to close the Formats panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Shapes' })).not.toBeVisible();

});