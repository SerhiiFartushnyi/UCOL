import { test, expect } from '@playwright/test';
import config from './config';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Shapes Options Applying
test('Upload Options Applying', async ({ page }) => {
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
    await page.pause(1000);
    const uploadsButton = page.getByRole('button', { name: 'Uploads', exact: true })

    await expect(uploadsButton).toBeVisible();
    await uploadsButton.click({ timeout: 1000 });

    // Assertion of Uploads Page
    await expect(page.locator('section').filter({ hasText: 'Uploads' })).toBeVisible();
    await expect(page.locator('#asset-library-content')).toBeVisible();

    await page.waitForLoadState('networkidle');
    await page.pause(1000);

    if (await page.getByText('No Elements').isVisible()) {
        console.log('No Uploads');
    } else {
        const noOfUploads = page.locator('#asset-library-content button');
        const numberOfUploads = await noOfUploads.count();
        console.log(`Number of Uploads: ${numberOfUploads}`);

        // Click on random Upload
        const randomUploadIndex = Math.floor(Math.random() * numberOfUploads);
        await noOfUploads.nth(randomUploadIndex).click();
        console.log(`Clicked on upload at index: ${randomUploadIndex}`);
    }

    //Search button
    await expect(page.getByPlaceholder('Search …')).toBeVisible();

    // Close button
    await expect(page.locator('button[name="panel\\.close\\.\\/\\/ly\\.img\\.panel\\/assetLibrary"]')).toBeVisible();

    // Add File button
    await expect(page.getByRole('button', { name: 'Add File' })).toBeVisible();

    // X button functionallity
    await page.locator('button[name="panel\\.close\\.\\/\\/ly\\.img\\.panel\\/assetLibrary"]').click();
    await expect(page.locator('section').filter({ hasText: 'Uploads' })).not.toBeVisible();

    // Click on Upload button again
    await uploadsButton.click();

    // click on random upload
    const noOfUploads = page.locator('#asset-library-content button');
    const numberOfUploads = await noOfUploads.count();
    const randomUploadIndex = Math.floor(Math.random() * numberOfUploads);
    await noOfUploads.nth(randomUploadIndex).click();

    await expect(page.getByText('Element', { exact: true })).toBeVisible();

    // Choose random file >> Array of file paths

    const filePaths = [
        '/Users/serhiifartushnyi/Downloads/473c3f48-646d-40fd-828d-501e2a86daa5.jpeg',
        '//Users/serhiifartushnyi/Downloads/MB-eCitaro_Paya.jpg',
        '/Users/serhiifartushnyi/Downloads/Art-PNG-Clipart.png'
    ];

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * filePaths.length);

    // Get the file path at the random index
    const randomFilePath = filePaths[randomIndex];

    // Click the 'Add File' button to trigger the file input
    await page.getByRole('button', { name: 'Add File' }).click();

    // Locate the specific hidden file input element and set the input files
    await page.locator('input[type="file"][name="Upload"]').setInputFiles(randomFilePath);

    console.log(`Uploaded file: ${randomFilePath}`);

    // Check for 201 status code response
    const response = await page.waitForResponse(response => response.status() === 201);
    expect(response.status()).toBe(201);
});