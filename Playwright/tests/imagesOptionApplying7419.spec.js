import { test, expect } from '@playwright/test';
import config from './config';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Images Options Applying
test('Images Options Applying', async ({ page }) => {
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
    const imagesButton = page.getByRole('button', { name: 'Images', exact: true })
//    await imagesButton.click();

    await expect(imagesButton).toBeVisible();
    await imagesButton.click({ timeout: 1000 });

    // Assertion of Formats Page 
    await expect(page.locator('section').filter({ hasText: 'Images' })).toBeVisible();
    await expect(page.locator('#asset-library-content')).toBeVisible();

    await page.waitForLoadState('networkidle');
    const imageButton = page.locator('#asset-library-content button')
    const numberOfImages = await imageButton.count();
    console.log(`Number of images: ${numberOfImages}`);

    // Click on randon image
    const randomImageIndex = Math.floor(Math.random() * numberOfImages);
    await imageButton.nth(randomImageIndex).click();

    console.log(`Clicked on image at index: ${randomImageIndex}`);

    //Search for a template Not existing Search request
    await page.getByPlaceholder('Search …').click();
    await page.getByPlaceholder('Search …').fill('064dridjwl');
    await page.getByPlaceholder('Search …').press('Enter');
    await page.getByPlaceholder('Search …').clear();

    // Search for a existing format 
    // const imgs = ['man', 'facebook', 'twitter', 'linkedin', 'pinterest', 'tiktok', 'youtube', 'snapchat', 'twitch', 'print', 'clothing'];
    // const randomFormat = formats[Math.floor(Math.random() * formats.length)]
    
//     // Chose a random format 
//     await page.getByPlaceholder('Search ...').click();
//     await page.getByPlaceholder('Search ...').fill(randomFormat);
//     await page.getByPlaceholder('Search ...').press('Enter');
//     console.log(`Searching for ${randomFormat} format`);

    
//     // Get the count of buttons after the search
//     const buttons = page.locator('#formats-container button', { hasText: randomFormat });
//     const buttonCount = await buttons.count();
//     console.log(`Number of buttons: ${buttonCount}`);

//     // Generate a random index
//     const randomIndex = Math.floor(Math.random() * buttonCount);

//     // Click on the button at the random index
//     await buttons.nth(randomIndex).click();

//     console.log(`Clicked on button at index: ${randomIndex}`);
//     await page.getByPlaceholder('Search ...').clear();

    // //Click on X button to close the Formats panel
    await page.locator('button[name="panel\\.close\\.\\/\\/ly\\.img\\.panel\\/assetLibrary"]').click();
    await expect(page.locator('section').filter({ hasText: 'Images' })).not.toBeVisible();

//     //Click on the random Formats button
//     await page.getByRole('button', { name: 'images' }).click();

//     const formatButtons = page.locator('#formats-container button');
//     const buttonsCounted2 = await formatButtons.count();

//     // Log the count of buttons
//     console.log(`Number of child buttons: ${buttonsCounted2}`);

//     if (buttonsCounted2 > 0) {
//         const randomIndex2 = Math.floor(Math.random() * buttonsCounted2);

//     // Click on a random Template button
//         await formatButtons.nth(randomIndex2).click();

//         console.log(`Clicked on the Style at index: ${randomIndex2}`);
//     } else {
//         console.log('No buttons found within #asset-library-content');
//     }

//     // Get the text of each button 
//     // This code should be refactored  Part with the button text extraction
//     // should be added to top of the test

//     const buttonTexts = new Set();

// // Iterate over each button to extract the text
// for (let i = 0; i < buttonsCounted2; i++) {
//   const buttonText = await formatButtons.nth(i).locator('div > p').last().innerText();
//   buttonTexts.add(buttonText);
// }
// const uniqueButtonTextsArray = Array.from(buttonTexts);

// console.log('Button texts:', uniqueButtonTextsArray);
});