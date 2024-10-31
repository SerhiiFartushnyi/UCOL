import { test, expect } from '@playwright/test';
import config from './config';
import { faker } from '@faker-js/faker';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Templates Options Applying
test('Templates Options Applying', async ({ page }) => {

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

     const templateButton = page.getByRole('button', { name: 'Templates' })
     await expect(templateButton).toBeVisible();
     await templateButton.click();

     // Assertion of Templete Page 

     await expect(page.locator('section').filter({ hasText: 'Library' })).toBeVisible();
     await expect(page.getByPlaceholder('Search …')).toBeVisible();
     await expect(page.locator('#asset-library-content')).toBeVisible();

     //Search for a template Not existing Search request
    const search = page.getByPlaceholder('Search …');
    await search.click();
    await search.fill('mountains');
    await search.press('Enter');
    await expect(page.getByText('No Elements')).toBeVisible();
    await search.clear();

    //Search for a template existing Search request
    await search.click();
    await search.fill('love story');
    await search.press('Enter');
    await expect(page.getByText('No Elements')).not.toBeVisible();
    await search.clear();

    //Click on X button

    await page.locator('button[name="panel\\.close\\.\\/\\/ly\\.img\\.panel\\/assetLibrary"]').click();
    await expect(page.locator('section').filter({ hasText: 'Library' })).not.toBeVisible();

    //Click on the template

    await templateButton.click();

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
    
    await expect(page.getByLabel('Editor canvas')).toBeVisible();

});




