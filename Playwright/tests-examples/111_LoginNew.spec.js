import { test, expect, request } from '@playwright/test';
const config = require('../tests/config');

test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;

test.skip ('API Login flow for coolab.ai with a logged-in page session', async ({ page }) => {
    // Step 1: Create a new request context for API requests
    const requestContext = await test.request.newContext();
  
    // Step 2: Get the login page and extract the CSRF token
    const loginPageResponse = await requestContext.get('https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/');
    const loginPageBody = await loginPageResponse.text();
    
    // Extract CSRF token from the page body
    const csrfTokenMatch = loginPageBody.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);
    if (!csrfTokenMatch) {
      throw new Error('CSRF token not found in the login page response');
    }
    const csrfToken = csrfTokenMatch[1];
  
    // Step 3: Send the pre-login request with extracted CSRF token
    const preLoginResponse = await requestContext.post('https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      },
      form: {
        csrfmiddlewaretoken: csrfToken,
        'log_in_view-current_step': 'pre_log_in_form',
        'pre_log_in_form-email': email
      }
    });
  
    if (!preLoginResponse.ok()) {
      throw new Error('Pre-login request failed');
    }
  
    // Step 4: Send the final login request
    const loginResponse = await requestContext.post('https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/',
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
  
    // Step 5: Get cookies after login
    const cookies = await requestContext.cookies();
  
    // Apply cookies to the page context
    await page.context().addCookies(cookies);
  
    // Step 6: Now navigate to the homepage as a logged-in user
    await page.goto('https://ucl-coolab-dev.uk.r.appspot.com');
  
    // Close the request context
    await requestContext.dispose();
  
    // Verify the login by checking for a welcome message or similar indication
    //await expect(page.locator('text=Welcome back')).toBeVisible();
  });