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

// Format Options Applying
test.skip ('Formats Options Applying', async ({ page }) => {
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
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible({ timeout: 10000 });
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
        }
    const formatButton = page.getByRole('button', { name: 'Formats' })
    await expect(formatButton).toBeVisible({ timeout: 10000 });
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
        }
    await formatButton.click({ timeout:10000 });

    // Assertion of Formats Page 
    await expect(page.locator('section').filter({ hasText: 'Formats' })).toBeVisible();
    await expect(page.locator('#formats-container')).toBeVisible();


    //Search for a template Not existing Search request
    await page.getByPlaceholder('Search ...').click();
    await page.getByPlaceholder('Search ...').fill('tik-tok');
    await page.getByPlaceholder('Search ...').press('Enter');
    await expect(page.getByText('No Elements')).toBeVisible({timeout: 10000});
    await page.getByPlaceholder('Search ...').clear();

    // // Search for a existing format Hardcoded
     const formats = ['instagram', 'facebook', 'twitter', 'linkedin', 'pinterest', 'tiktok', 'youtube', 'snapchat', 'twitch', 'print', 'clothing'];
     const randomFormat = formats[Math.floor(Math.random() * formats.length)]
    
    // Chose a random format 
    await page.getByPlaceholder('Search ...').click();
    await page.getByPlaceholder('Search ...').fill(randomFormat);
    await page.getByPlaceholder('Search ...').press('Enter');
    console.log(`Searching for ${randomFormat} format`);

    // Get the count of buttons after the search
    await page.waitForSelector('#formats-container button');
    const buttons = page.locator('#formats-container button', { hasText: randomFormat });
    const buttonCount = await buttons.count();
    console.log(`Number of buttons: ${buttonCount}`);

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * buttonCount);

    // Click on the button at the random index
    await buttons.nth(randomIndex).click("Enter");

    console.log(`Clicked on button at index: ${randomIndex}`);
    await page.getByPlaceholder('Search ...').clear();

    // //Click on X button to close the Formats panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Formats' })).not.toBeVisible();

    //Click on the random Formats button
    await page.getByRole('button', { name: 'Formats' }).click();

    const formatButtons = page.locator('#formats-container button');
    const buttonsCounted2 = await formatButtons.count();

    // Log the count of buttons
    console.log(`Number of child buttons: ${buttonsCounted2}`);

    if (buttonsCounted2 > 0) {
        const randomIndex2 = Math.floor(Math.random() * buttonsCounted2);

    // Click on a random Template button
        await formatButtons.nth(randomIndex2).click();

        console.log(`Clicked on the Style at index: ${randomIndex2}`);
    } else {
        console.log('No buttons found within #asset-library-content');
    }

    // !!!  Get the text of each button >> Made at formatOptionsApplying7418_2.spec.js
    // This code should be refactored  Part with the button text extraction
    // should be added to top of the test

//     const buttonTexts = new Set();

// // Iterate over each button to extract the text
// for (let i = 0; i < buttonsCounted2; i++) {
//   const buttonText = await formatButtons.nth(i).locator('div > p').last().innerText();
//   buttonTexts.add(buttonText);
// }
// const uniqueButtonTextsArray = Array.from(buttonTexts);

// console.log('Button texts:', uniqueButtonTextsArray);
});