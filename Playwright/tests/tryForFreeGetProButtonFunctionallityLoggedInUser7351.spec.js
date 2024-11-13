import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

const email = config.mail;
const password = config.password;

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

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

});

// Free To Use Button
test('Free to use button', async ({ page }) => {

    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    // Find the text 'FREE-to-use' and scroll to it
    const textLocator = page.getByText('FREE-to-use');
    await textLocator.scrollIntoViewIfNeeded();

    // Click on the 'Try for free' button
    await page.getByRole('link', { name: 'try for free' }).click();

    // Check Page Text
    await expect(page.getByText('my projects')).toBeVisible();

    // Check URL
    expect(page.url()).toContain('/studio/');

});

// Free To Use Button
test('Get Pro button', async ({ page }) => {

    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    //Find the text 'PRO' and scroll to it
    const textLocator = page.getByText('PRO', { exact: true })
    await textLocator.scrollIntoViewIfNeeded();

    //Click on the 'Get Pro' button
    await page.getByRole('link', { name: 'get pro' }).click();

    // Check Page Text
    await expect(page.getByText('my projects')).toBeVisible();

    // Check URL
    expect(page.url()).toContain('/studio/');

});
