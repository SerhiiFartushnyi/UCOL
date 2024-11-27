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

// Save button functionality
test('Undo Button Functionality', async ({ page }) => {
    test.slow();
    
    //Login
    await login(page, email, password); 

    // Navigate to site  
    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    //Click on the create template button
    await expect(page.locator('#create-template')).toContainText('start designing');
    page.locator('#create-template').click();

    //await page.waitForSelector('#asset-library-content');
    await page.getByRole('button', { name: 'Templates' }).click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    
    // Locate all child buttons within the element with the ID 'asset-library-content'
    await page.waitForSelector('#asset-library-content button ');
    const buttons = page.locator('#asset-library-content button');
    const buttonsCount = await buttons.count();

    // Log the count of buttons
    console.log(`Number of child buttons: ${buttonsCount}`);

    if (buttonsCount > 0) {
        const randomIndex = Math.floor(Math.random() * buttonsCount);
        // Click on a random Template button
        await buttons.nth(randomIndex).click();
        console.log(`Clicked on button at index: ${randomIndex}`);
    } else {
        console.log('No buttons found within #asset-library-content');
    }

    // Check if the undo button is disabled
    const undoButton = await page.getByRole('button', { name: "undo" });
    const isDisabled = await undoButton.evaluate(element => element.classList.contains('disabled'));

    console.log(`Is undo button enabled? ${isDisabled}`);
    expect(isDisabled).toBe(false);

    await page.getByRole('button', { name: 'Shapes' }).click();

    // Count all the shape buttons and click on a random shape button
    const shapeButton = page.locator('#asset-library-content button');
    const shapeButtonsCount = await shapeButton.count();

    console.log(`Number of Shape buttons: ${shapeButtonsCount}`);

    const randomShapeIndex = Math.floor(Math.random() * shapeButtonsCount);
    await shapeButton.nth(randomShapeIndex).click();
    console.log(`Clicked Shape at index: ${randomShapeIndex}`);

    // Check if the undo button is enabled
    const undoButtonEnabled = await undoButton.evaluate(element => !element.classList.contains('disabled'));
    const isUndoButtonEnabled = await undoButtonEnabled;

    await expect(isUndoButtonEnabled).toBe(true);

    console.log(`Is undo button enabled? ${isUndoButtonEnabled}`);

    // Click on the undo button
    await undoButton.click();

    await expect(page.getByText('Document')).toBeVisible({ timeout: 10000 });

});