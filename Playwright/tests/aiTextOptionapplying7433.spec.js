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

//AI Text Options Applying

test ('AI Text Options Applying', async ({ page }) => {
    test.slow();

// Step 1: Load the login page and extract CSRF token
  
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

    // Assertion of AI Page
    await page.waitForLoadState('networkidle');
    await expect(page.locator('section').filter({ hasText: 'Write your text with A.I.' })).toBeVisible();
    await expect(page.getByPlaceholder('What do you want to write')).toBeVisible();
    await expect(page.getByText('What are you writing for?')).toBeVisible();
    await expect (page.locator('#generate-btn')).toBeDisabled();

    // Locate the select element
    const selectElement = page.locator('#writing-for');

    // Extract the options
    const options = await selectElement.locator('option').allTextContents();

    // Log the options
    console.log('Available options:', options);

    const expectedOptions = ['Body', 'Free-form', 'Headline']; // Add all expected options here
    expectedOptions.forEach(option => {
    expect(options).toContain(option, `Option "${option}" should be available.`);
    });

    // Assertion of Footer buttons
    await expect(page.locator('#tab-container').getByRole('button', { name: 'GENERATE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HISTORY' })).toBeVisible();

    //Assertion of AI Page Functionality 
    await page.getByPlaceholder('What do you want to write').click();
    await page.getByPlaceholder('What do you want to write').fill(text);
    await expect (page.locator('#generate-btn')).toBeEnabled();
    await page.locator('#generate-btn').click();

    page.waitForLoadState('networkidle');

    // Assertion if Page has changed to  Rephrase Panel
    await expect(page.locator('section').filter({ hasText: 'Rephrase' })).toBeVisible();
});