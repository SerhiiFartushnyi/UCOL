import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });
const email = config.mail1;
const password = config.password1;

test('Brand Room Functionallity',async ({ page }) => {

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

    await page.locator('#features-dropdown-toggler div').filter({ hasText: 'features' }).click();
    await page.locator('#brand-room-link').click();

    // Check if we are on the Brand Room Page

    await expect(page.locator('#brand-room-tabs')).toContainText('Brand Room');
    await expect(page.getByText('Brand Room', {exact: true})).toBeVisible();
    expect(page.url()).toContain('/projects/#brand-room');
});

