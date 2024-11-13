import { test, expect } from '@playwright/test';
import { time } from 'console';
import { timeout } from '../playwright.config';
const config = require('./config');

/* 
//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail1;
let password = config.password1;

test.beforeEach(async ({ page }) => { 
    await page.goto('/');
    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    // Used the saved email from the config file
    await page.getByPlaceholder('enter your e-mail address').fill(email);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
});

test ('Features > Format Extender Page Functionallity', async ({ page }) => {

    // Go to Features and click Format Extender
    await page.getByText('features', { exact: true }).hover();
 
    await page.getByRole('link', { name: 'format extender' }).click();

    //Check format extender page and button 
    await expect(page.locator('body')).toContainText('create a whole set of designs in a few simple clicks');
    await expect(page.getByRole('link', { name: 'start now' }).first()).toBeVisible();
    await page.getByRole('link', { name: 'start now' }).first().click();

    // Check if we are on the Studio Page
    expect(page.url()).toContain('/tool/studio/');

    // wait for Loading Studio Page 
    await page.waitForLoadState('networkidle');

    // Choose Format Extender and click
    await expect(page.locator('#format-extender')).toContainText('format extender');
    await page.locator('#format-extender').click();

    // Choose random project 
    await page.waitForLoadState('networkidle');
    const containers = await page.locator('.project--image-container--image');
     const containerCount = await containers.count();
     const randomIndex3 = Math.floor(Math.random() * containerCount);
     await containers.nth(randomIndex3).click();

   // Click Next Button
    await page.getByRole('button', { name: 'next' }).click();

    // Choose format in Formats page (Randon from all existing formats)
    // Get all the checkboxes
    await page.waitForSelector('.formats-container--dropdown--formats--option--checkbox');
    const checkboxes = await page.locator('.formats-container--dropdown--formats--option--checkbox');
    // Get the count of checkboxes
    
    const checkboxCount = await checkboxes.count();
    console.log(checkboxCount, 'checkbox count');

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * checkboxCount);
    // Check the checkbox at the random index
    await checkboxes.nth(randomIndex).check();
    console.log(randomIndex, 'checkbox checked');
    
    await page.getByRole('button', { name: 'next' }).click();
    await expect(page.locator('#root')).toContainText('creating formats...');

    await page.waitForLoadState('networkidle');
    // Wait Untill Format was generated 
    await page.waitForTimeout(5000);

    // Check titles of the generated formats page 
   
    await expect(page.getByText('Select the generated options')).toContainText('Select the generated options you’d like to save to your project folder, or download them directly.');

    await expect(page.locator('#root')).toContainText('add more formats');
    await expect(page.locator('#root')).toContainText('Save');
    await page.getByRole('button', { name: /Save .*/ }).click();

    await expect(page.locator('#root')).toContainText('my projects');
    //const downloadPromise = page.waitForEvent('download');
    await page.getByText('download all').click();

    // const download = await downloadPromise;
    // await page.getByText('homeCampaign-1729771939-').click();
});

test.skip ('Project > Format Extender Page Functionality', async ({ page }) => {

    // Check if the user is logged in
   const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible();
    await profileIcon.click();
    
    // Go to Projects and click Format Extender
    await page.goto('/projects/');
    await page.locator('#ui-id-2').click();

    await page.getByRole('button', { name: 'extend format' }).click();

    // await page.waitForLoadState('networkidle');
    // await page.waitForSelector('.formats-container--dropdown--formats--option--checkbox');
    // // const containers = page.locator('[class="infinite-item selection-area-el flex flex-col w-[186px] h-fit sm:w-full border-[#e5e5e5] border-solid border-2"]');
    // // const containers = page.locator('#project-item-container .w-\\[85\\%\\]');
    //await page.waitForSelector('#projects-container #project-item');

    //await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for 5000 milliseconds (5 seconds)
    const containers = page.locator('#projects-container #project-item');

     console.log(containers, ' Format Extender item');

    const containerCount = await containers.count();
    console.log(containerCount, ' Counted items');
 
    const randomIndex3 = Math.floor(Math.random() * containerCount);
    await containers.nth(randomIndex3).click();

    //await page.locator('#format-extender-tab-content > #projects-container > .selection-area-container > #project-item > .project-item-container > div:nth-child(2) > .w-\\[85\\%\\] > p:nth-child(2)').first().click();

    await page.getByRole('button', { name: 'next' }).click();
    
    // Choose format in Formats page (Random from all existing formats)

    // Get all the checkboxes
    const checkboxes = await page.locator('.format-checkbox');
    const checkboxCount = await checkboxes.count();
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * checkboxCount);
    // Check the checkbox at the random index
    await checkboxes.nth(randomIndex).check();

    // Waiting for the formats to be generated
    await page.getByRole('button', { name: 'generate' }).click();
    await expect(page.locator('#format-extender-tab-content')).toContainText('generating formats...');
    await page.waitForTimeout(8000);

    // Check titles of the generated formats page
    await expect(page.locator('#format-extender-tab-content')).toContainText('add more formats');
    
    //await expect(page.locator('#save-formats-btn')).toContainText('save (1) formats');
    await expect(page.locator('#save-formats-btn')).toContainText(/save .*/);

    //await page.getByRole('button', { name: 'save (1) formats' }).click();
    await page.getByRole('button', { name: /save .*/ }).click();

    await expect(page.locator('#format-extender')).toContainText('Format Extender');

    await page.getByRole('button', { name: 'save ' }).click();
    await expect(page.locator('#format-extender')).toContainText('Format Extender');
});
