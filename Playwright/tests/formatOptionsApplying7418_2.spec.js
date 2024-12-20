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
test('Formats Options Applying', async ({ page }) => {
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
    await expect(startDesigning).toHaveText('start designing')
    await expect(startDesigning).toBeVisible();
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
        }

    const formatButton = page.getByRole('button', { name: 'Formats' })
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
        }
    await expect(formatButton).toBeVisible({ timeout: 10000 });
    await formatButton.click({ timeout: 1000 });

    //Click on the random Formats button
    await expect(page.locator('section').filter({ hasText: 'Formats' })).toBeVisible({timeout: 10000 });
    await page.getByRole('button', { name: 'Formats' }).click();
    
    await page.waitForSelector('#formats-container button');
    const formatButtons = page.locator('#formats-container button');
    const buttonsCounted2 = await formatButtons.count();

    // Log the count of buttons
    console.log(`Number of child buttons: ${buttonsCounted2}`);

    await page.getByRole('button', { name: 'Formats' }).click();

    // Get the text of each button
    const buttonTexts = new Set();

    // Iterate over each "Format button" to extract the unique format texts
    for (let i = 0; i < buttonsCounted2; i++) {
        const buttonText = await formatButtons.nth(i).locator('div > p').last().innerText();
        buttonTexts.add(buttonText);
    }

    const uniqueButtonTextsArray = Array.from(buttonTexts);
    console.log('Unique Formats:', uniqueButtonTextsArray);

    const formats = uniqueButtonTextsArray
    const uniqueFormat = formats[Math.floor(Math.random() * formats.length)]
    console.log('Unique Formats:', uniqueFormat);

    // Fill search with random format
    const search = page.getByPlaceholder('Search ...');
    await search.click();
    await search.fill(uniqueFormat);
    await search.press('Enter');

    // Count the number of formats after the search
    await page.waitForSelector('#formats-container button');
    const formats2 = page.locator('#formats-container button', { hasText: uniqueFormat });
    const formatsCounted3 = await formats2.count();

    console.log(`Number of buttons: ${formatsCounted3}`);

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * formatsCounted3);

    // Get the text of the button at the random index
    const buttonText = await formats2.nth(randomIndex).textContent();
    console.log(`Text of the button at index ${randomIndex}: ${buttonText}`);

    let width, height;
    const dimensions = buttonText.match(/\d+/g);
    if (dimensions && dimensions.length >= 2) {
        width = parseInt(dimensions[0], 10); // First number is width
        height = parseInt(dimensions[1], 10); // Second number is height
        console.log(`Extracted dimensions: Width = ${width}, Height = ${height}`);
    } else {
        console.error('Could not extract dimensions from the button text.');
        throw new Error('Could not extract dimensions from the button text.');
    }

    // Click on the button at the random index
    await formats2.nth(randomIndex).click();

    console.log(`Clicked on button at index: ${randomIndex}`);

    // Intercept and check the POST request
    const [response] = await Promise.all([
        page.waitForResponse('/api/helpers/scale-scene/'),
        page.locator('[aria-label="Editor canvas"]').click()
    ]);

    // Check if the response status is 200
    expect(response.status()).toBe(200);

    //Close the inspector panel
    await page.locator('button[aria-label="Close"]').last().click();

    const widthElement = page.locator('#pages-width');
    const heightElement = page.locator('#pages-height');

    // Extract the width and height values from the page
    const actualWidth = await widthElement.inputValue();
    const actualHeight = await heightElement.inputValue();
    console.log(`Actual width value: ${actualWidth}`);
    console.log(`Actual height value: ${actualHeight}`);

    // Check that dimentions are equal
    await expect(widthElement).toHaveValue(width.toString());
    await expect(heightElement).toHaveValue(height.toString());

    //Search for a template Not existing Search request
    
    await search.click();
    await search.fill('tik-tok');
    await search.press('Enter');
    await expect(page.getByText('No Elements')).toBeVisible();
    await search.clear();

    // //Click on X button to close the Formats panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Formats' })).not.toBeVisible();

});