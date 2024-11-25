import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail2;
const password = config.password;

// Generate random names using Faker
const randomName = faker.person.firstName();
const randomSurname = faker.person.lastName();

// Update Progile

test('Update Profile', async ({ page }) => {

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
            'Referer': `${config.baseUrl}/modal/log-in/`,
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
    
    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    //await page.waitForLoadState('networkidle');
    await page.waitForSelector('#profile-toggler-container');
    await page.locator('#profile-toggler-container').click();

    await page.getByRole('link', { name: 'Go to Account Settings' }).click();

    // Check if I am on Account page 
    await expect(page.getByText('Account', { exact: true })).toBeVisible();
    await page.locator('#full_name').click();

    // Update the User Full Name
    // Check Popup to be visible
    await expect(page.getByText('update profile')).toBeVisible({ timeout: 10000 });

    await page.locator('input[name="first_name"]').fill(randomName);
    await page.locator('input[name="last_name"]').fill(randomSurname);
    await page.locator('input[name="username"]').fill(randomName + randomSurname);
    await page.locator('input[name="username"]').press(' ')

    // Check the Save button to be visible and click it
    await expect(page.locator('#profile-info-submit-btn', { hasText: 'save' })).toBeVisible({ timeout: 10000 });
    await page.locator('#profile-info-submit-btn', { hasText: 'save' }).click();

    // Test Success Message
    const loggedInMessage = await page.getByText('Profile updated successfully.');
    await expect(loggedInMessage).toHaveText('Profile updated successfully.');

    // Test updated User Full Name
    await expect(page.locator('#full_name')).toHaveText(randomName + ' ' + randomSurname);

});

