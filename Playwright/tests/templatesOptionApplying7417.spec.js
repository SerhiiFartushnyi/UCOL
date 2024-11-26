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

// Templates Options Applying
test ('Templates Options Applying', async ({ page }) => {
    test.slow();
    
    //Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    await page.pause();
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
     await expect(startDesigning).toBeVisible();
     await startDesigning.click();

     //await page.waitForLoadState('networkidle');
     if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
     const templateButton = page.getByRole('button', { name: 'Templates' })
     await expect(templateButton).toBeVisible({ timeout: 10000 });
     await templateButton.click();

     // Assertion of Templete Page 
     await expect(page.locator('section').filter({ hasText: 'Library' })).toBeVisible({timeout:10000 });
     await expect(page.getByPlaceholder('Search …')).toBeVisible({timeout:10000 });
     await expect(page.locator('#asset-library-content')).toBeVisible({timeout:10000 });

     //Search for a template Not existing Search request
    const search = page.getByPlaceholder('Search …');
    await search.click();
    await search.fill('mountains');
    await search.press('Enter');
    await expect(page.getByText('No Elements')).toBeVisible({timeout:10000});
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




