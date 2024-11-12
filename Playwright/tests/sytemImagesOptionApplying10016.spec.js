import { test, expect } from '@playwright/test';
import config from './config';

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// System Images Options Applying
test('System Images Options Applying', async ({ page }) => {
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
    const imagesButton = page.getByRole('button', { name: 'System Images', exact: true })
//    await imagesButton.click();

    await expect(imagesButton).toBeVisible();
    await imagesButton.click({ timeout: 1000 });

    // Assertion of Formats Page 
    await expect(page.locator('section').filter({ hasText: 'Library' })).toBeVisible();
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

    await expect(page.getByText('No Elements')).toBeVisible();
    await page.getByPlaceholder('Search …').clear();

    // //Click on X button to close the Formats panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Library' })).not.toBeVisible();
});