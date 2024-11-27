import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();
import { faker } from '@faker-js/faker';

/*
BEGOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Generate random words using Faker
const randomWord = faker.lorem.word();
const randomDescription = faker.lorem.sentence();

// Successful Asset Upload With Valid Values
test('succsessful Asset Upload With Valid Values', async ({ page }) => {
    test.slow();
   
    // Login
    await login(page, email, password);

     // Navigate to site  
     await page.goto('/');

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#profile-toggler-container');
    await page.locator('#profile-toggler-container').click();

    await page.getByRole('link', { name: 'Go to Projects' }).click();
    // Check if we are on the Assets Upload Page
    await expect(page.locator('#ui-id-4')).toContainText('assets upload');
    await page.getByRole('link', { name: 'assets upload' }).click();

    await page.getByPlaceholder('name', { exact: true }).click();

    // Fill the form with valid values
    await page.getByPlaceholder('name', { exact: true }).fill(randomWord);
    await page.getByPlaceholder('description').click();
    await page.getByPlaceholder('description').fill(randomDescription);

    await page.locator('[placeholder="select asset type"]').click();

    // Choose a random item from the dropdown
    const items = ['Image', 'System Image', 'Shape'];
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    await page.getByText(randomItem, { exact: true }).click();

    // Select a random category
    await page.waitForSelector('[placeholder="select category"]')
    await page.locator('[placeholder="select category"]').click();
    //await page.waitForSelector('[placeholder="select category"]');

    // Choose a random item from the dropdown
    const category = ['test assets', 'basic', 'shapes', 'abstract'];
    const randomIndex2 = Math.floor(Math.random() * category.length);
    const randomCategory = category[randomIndex2];

    await page.getByText(randomCategory, { exact: true }).click();

    //await page.locator('[placeholder="select tags"]').click();
    // await page.locator('#assetUploadForm div').filter({ hasText: 'Tags ×' }).locator('div').nth(1).click();
    await page.getByPlaceholder('Select tags', { exact: true }).fill('image');
    page.getByPlaceholder('Select tags', { exact: true }).press('Enter');

    await page.locator('#file_input').setInputFiles('/Users/serhiifartushnyi/Downloads/473c3f48-646d-40fd-828d-501e2a86daa5.jpeg');
    await page.getByRole('button', { name: 'Save' }).click();

    // Assert that the success message is displayed
    await page.waitForSelector('#successMessage');
    await expect(page.locator('#successMessage')).toContainText('Shape has been successfully uploaded');

});

