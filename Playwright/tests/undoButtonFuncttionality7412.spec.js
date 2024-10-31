// !!!! Idea to check pictures difference: ????
import { test, expect } from '@playwright/test';
import config from './config';
import fs from 'fs';
import { PNG } from 'pngjs';
//import pixelmatch from 'pixelmatch';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Undo button functionality
test.skip ('Undo Button Funct', async ({ page }) => {

    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill(mail);

    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');
   
    //Click on the create template button
    await expect(page.locator('#create-template')).toContainText('start designing');
    page.locator('#create-template').click();

    //await page.waitForSelector('#asset-library-content');
    await page.getByRole('button', { name: 'Templates' }).click();

    await page.waitForLoadState('networkidle');
    // Locate all child buttons within the element with the ID 'asset-library-content'

    const buttons = page.locator('#asset-library-content button');
    const buttonsCount = await buttons.count();

    // Log the count of buttons
    console.log(`Number of child buttons: ${buttonsCount}`);

    if (buttonsCount > 0) {
        const randomIndex = Math.floor(Math.random() * buttonsCount);
        await buttons.nth(randomIndex).click();
        console.log(`Clicked on button at index: ${randomIndex}`);
    } else {
        console.log('No buttons found within #asset-library-content');
    }

    // Take the first snapshot
    const canvas = await page.getByLabel('Editor canvas');
    
    await canvas.screenshot({ path: 'canvas_snapshot_1.png' });

    // Check if the undo button is disabled
    const undoButton = await page.getByRole('button', { name: "undo" });
    const isDisabled = await undoButton.evaluate(element => element.classList.contains('disabled'));

    console.log(`Is undo button disabled? ${isDisabled}`);

    await page.getByRole('button', { name: 'Shapes' }).click();
    await page.getByRole('button', { name: 'badge' }).click();

    // Check if the undo button is enabled
    const undoButtonEnabled = await undoButton.evaluate(element => !element.classList.contains('disabled'));
    const isUndoButtonEnabled = await undoButtonEnabled;

    console.log(`Is undo button enabled? ${isUndoButtonEnabled}`);

    // Click on the undo button
    await undoButton.click();

await canvas.screenshot({ path: 'canvas_snapshot_2.png' });

// Load both snapshots for comparison
const img1 = PNG.sync.read(fs.readFileSync('canvas_snapshot_1.png'));
const img2 = PNG.sync.read(fs.readFileSync('canvas_snapshot_2.png'));

// Create an empty PNG to store the diff
const { width, height } = img1;
const diff = new PNG({ width, height });

// // Compare the images
// const pixelDifference = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

// // Save the diff image if needed
// fs.writeFileSync('diff.png', PNG.sync.write(diff));

// console.log(`Pixel differences: ${pixelDifference}`);

});