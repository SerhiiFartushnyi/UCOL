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

// p2d Tab Opened Functionallity !!!!
// WERY SLOW TEST :)

test.skip ('p2d Tab Opened', async ({ page }) => {
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

    // Go To Scene Tab
    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    await page.getByRole('link', { name: 'start now' }).first().click();

    //Click on the p2d tab
    await page.getByText('p2d').click();

    // Page assertions 
    await expect(page.getByText('What kind of social post are')).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('Write a prompt to create your')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('img', { name: 'randomize' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible({ timeout: 10000 });
 

    // Click on the randomize button
    await page.getByRole('img', { name: 'randomize' }).click();

    const inputField = page.getByPlaceholder('Write a prompt to create your');

    // Get the value of the input field
    const inputValue = await inputField.inputValue();

    // Assert that the value is not empty
    expect(inputValue).not.toBe('');

    // List of titles
    const titles = [
        'Design an Instagram Story for a wellness retreat.',
        'Design an Instagram Post Landscape for a tech gadget launch.',
        'Design a Twitter post for a virtual conference announcement.',
        'Design a Facebook post for a community fundraising event.',
        'Design a LinkedIn post for a new job opening in a marketing firm.',
        'Design a Pinterest Pin for a DIY home decor tutorial.',
        'Design a YouTube thumbnail for a cooking channel’s latest recipe.',
        'Design a TikTok cover for a travel vlog series.',
        'Design a Snapchat Geofilter for a city marathon.',
        'Design a Reddit post image for a gaming community’s new event.'
    ];

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * titles.length);

    // Get the random title
    const randomTitle = titles[randomIndex];

    // Fill the placeholder with the selected title
    await page.getByPlaceholder('Write a prompt to create your').fill(randomTitle);

    console.log(`Filled with: ${randomTitle}`);

    const imageReplacementType = [
        'Default', 'Use generated images', 'Use internal images', 'Use external images', 'By subject relevance'
    ]
    // Generate a random index
const imageReplacementTypeCount = imageReplacementType.length;
const randomImageReplacementType = imageReplacementType[Math.floor(Math.random() * imageReplacementTypeCount)];

await page.getByText('Image replacement type').click();
//await page.getByText(randomImageReplacementType,  {exact: true} ).click();

// Select the image replacement type

await page.waitForSelector('#react-select-3-placeholder');
await page.getByText(randomImageReplacementType, {exact: true}).click();

const genres = [
    "ARLES", "BANKSY", "ART SOUP", "BASS", "CHATGPT", "DALLY", "CHIBI", "DREAMS", "GOOG"
];

const randomIndex2 = Math.floor(Math.random() * genres.length);
const randomGenre = genres[randomIndex2];
console.log('Random Genre:', randomGenre);

await page.getByText('Template Genre').click();
await page.pause(1000);
await page.getByText(randomGenre, {exact: true}).click();


const formats = [
    "Profile Picture", "Story", "Reel", "Stories", "Company Logo"
];

const randomIndex3 = Math.floor(Math.random() * formats.length);
const randomFormat = formats[randomIndex3];
await page.getByText('Template Format').click();
await page.pause(1000);
await page.getByText(randomFormat, {exact: true}).click();

//await page.getByRole('checkbox').first().check({ force: true });

// Chose random anount from 1 to 5
const randomAmount = Math.floor(Math.random() * 5) + 1;
await page.getByText('Choose amount').click();
await page.pause(500);
await page.getByText(`${randomAmount}`, { exact: true }).click();


 await page.getByRole('button', { name: 'start' }).click();

    await expect(page.getByText('select your favorite style')).toBeVisible({ timeout: 10000 });
    page.url().includes('/tool/studio/');

    // Count the child <div> elements
    await page.waitForSelector('.p2d-container--content--generation-container');
    const parentElement = page.locator('.p2d-container--content--generation-container').locator('button');
    const childButtonCount = await parentElement.count();

    // Assert that the count is exactly 3
    expect(childButtonCount).toBe(randomAmount);

    // Check if the elements are visible
    await expect(page.getByRole('button', { name: 'star select' }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'reload restart' })).toBeVisible({ timeout: 10000 });

    // Restart the process
    await page.getByRole('button', { name: 'reload restart' }).click();
   
    // Check if User is on Tool Studio Page
    expect(page.url()).toContain('/tool/studio/');

    // // Count the button elements and click on a random one
    // const buttonCount = await parentElement.count();
    // console.log(`Number of buttons: ${buttonCount}`);

    // // Ensure there are buttons to click
    // if (buttonCount > 0) {
    //     // Generate a random index
    //     const randomIndex = Math.floor(Math.random() * buttonCount);

    //     // Click on the button at the random index
    //     await parentElement.nth(randomIndex).click();

    //     console.log(`Clicked on button at index: ${randomIndex}`);
    // } else {
    //     console.log('No buttons found in .p2d-container--content--generation-container');
    // }
    // // Check if User is redirected to Scene Page 
    // expect(page.url()).toContain('/tool/studio/');

    // await expect(page.locator('.p2d-container--header--title')).toHaveText('generating your design...')

    // // Check if the user is redirected to the scene page
    // await page.waitForFunction(() => location.href.includes('/tool/scene/'), { timeout: 100000 });
    // expect(page.url()).toContain('/tool/scene/');

    await expect(page.getByText('What kind of social post are you making?')).toBeVisible({ timeout: 10000 });
    page.url().includes('/tool/studio/');

});