//Updated:13Nov24
import { test, expect } from '@playwright/test';
import config from './config';

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;
const text = config.rephraseText;

// Rephrase Options Applying
test ('Rephrase Options Applying', async ({ page }) => {
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
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    await page.waitForLoadState('networkidle');

    //Click on the create template button
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible();
    await startDesigning.click();

    await page.waitForLoadState('networkidle');
    const textButton = page.getByRole('button', { name: 'A.I. Text', exact: true })

    await expect(textButton).toBeVisible();
    await textButton.click({ timeout: 1000 });
    await page.waitForSelector('section');
    await expect(page.locator('section').filter({ hasText: 'Write your text with A.I.' })).toBeVisible();
    await expect(page.locator('#tab-container').getByRole('button', { name: 'GENERATE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HISTORY' })).toBeVisible();

    // Assertion of AI Page
    await page.getByPlaceholder('What do you want to write').click();
    await page.getByPlaceholder('What do you want to write').fill(text);
    await page.locator('#generate-btn').click();

    page.waitForLoadState('networkidle');

    const rewriteButton = page.getByRole('button', { name: 'REWRITE' });

    // Extend button click
    await page.getByText('Rewrite your text to elaborate').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible();

    // Shorten button click
    await page.getByText('Rewrite your text to be more concise').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible();

   //Rewrite button click
    await page.getByText('Rewrite your text in a different way').click();
    await rewriteButton.click();
    await expect(page.getByRole('button', { name: 'LOADING' })).toBeVisible();
    
    
    // Click on X button to close Rephrase panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.getByRole('heading', { name: 'Rephrase' })).not.toBeVisible();

    // Open the Rephrase panel again
    await textButton.click({ timeout: 1000 });

    // Click on History button
    await page.getByRole('button', { name: 'HISTORY' }).click();
    await expect(page.locator('.history-content')).toBeVisible();
    await page.getByLabel('Editor canvas').click();

    // Click on Generate button on Footer
    await page.locator('.tab-container button', {hasText: 'GENERATE'}).click();
    // Check if the Write your text with A.I. is visible
    await expect(page.getByRole('heading', { name: 'Write your text with A.I.' })).toBeVisible();

});