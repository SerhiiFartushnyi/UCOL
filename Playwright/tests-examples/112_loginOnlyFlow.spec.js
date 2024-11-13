import { test, expect, request } from '@playwright/test';
const config = require('../tests/config');

test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;

test('API Login flow for coolab.ai', async ({ page }) => {
  // Step 1: Load the login page and extract CSRF token
  
  await page.goto('/modal/log-in/');

  // Wait for CSRF token to be available
  const csrfToken = await page.getAttribute('input[name="csrfmiddlewaretoken"]', 'value');
  if (!csrfToken) {
    throw new Error('CSRF token not found on the login page');
  }

  //console.log('Extracted CSRF Token:', csrfToken);

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
  //console.log('Pre-login response status:', preLoginResponse.status());
  const preLoginBody = await preLoginResponse.text();
  //console.log('Pre-login response body:', preLoginBody);

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

//   await expect(page.getByText('Welcome back')).toBeVisible();
});