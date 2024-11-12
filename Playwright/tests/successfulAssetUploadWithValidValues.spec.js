import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';

const config = require('./config');

/*
BEGOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Generate random words using Faker
const randomWord = faker.lorem.word();
const randomDescription = faker.lorem.sentence();

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Enter the login credentials
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill(mail);

    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);

    await page.getByRole('button', { name: 'Log in' }).click();

});

// Go to Projects and click on Assets Upload
test('succsessful Asset Upload With Valid Values', async ({ page }) => {
    await page.waitForLoadState('networkidle');
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
    await page.locator('[placeholder="select category"]').click();
    await page.waitForSelector('[placeholder="select category"]');

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
    await expect(page.locator('#successMessage')).toContainText('Shape has been successfully uploaded');

});

