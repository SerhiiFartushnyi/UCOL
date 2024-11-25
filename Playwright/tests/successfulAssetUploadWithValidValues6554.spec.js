import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const config = require('./config');

/*
BEGOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;

// Generate random words using Faker
const randomWord = faker.lorem.word();
const randomDescription = faker.lorem.sentence();

test.beforeEach(async ({ page }) => {
    test.slow();
    await page.goto('/modal/log-in/');

    // Wait for CSRF token to be available
    const csrfToken = await page.getAttribute('input[name="csrfmiddlewaretoken"]', 'value');
    if (!csrfToken) {
        throw new Error('CSRF token not found on the login page');
    }

    // Step 2: Send the pre-login request with extracted CSRF token
    const preLoginResponse = await page.request.post('/modal/log-in/', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': `${config.baseUrl}/modal/log-in/`, // This is the URL of the login page ///
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
        },
        form: {
            csrfmiddlewaretoken: csrfToken,
            'log_in_view-current_step': 'pre_log_in_form',
            'pre_log_in_form-email': email
        }
    });

    // Log pre-login response details for debugging
    const preLoginBody = await preLoginResponse.text();

    if (!preLoginResponse.ok()) {
        throw new Error('Pre-login request failed');
    }

    // Step 3: Send the final login request
    const loginResponse = await page.request.post('/modal/log-in/', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': `${config.baseUrl}/modal/log-in/`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
        },
        form: {
            csrfmiddlewaretoken: csrfToken,
            'log_in_view-current_step': 'normal_log_in_form',
            'normal_log_in_form-username': email,
            'normal_log_in_form-password': password
        }
    });

    if (!loginResponse.ok()) {
        throw new Error('Login request failed');
    }

    // Navigate to site  
    await page.goto('/');
});

// Go to Projects and click on Assets Upload
test('succsessful Asset Upload With Valid Values', async ({ page }) => {
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

