import { test, expect, request } from '@playwright/test';

const email = 'serhii.fartushnyi+eg@coaxsoft.com';
const password = 'Qwert12345!';

test.skip ('API Login flow for coolab.ai', async ({ page }) => {
  // Create a new request context
  const apiContext = await request.newContext();

  // Step 1: Send a GET request to retrieve the CSRF token and session ID
  const getResponse = await apiContext.get('https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/?_=1731316690108');
  const headers = getResponse.headers();
  console.log('Response Headers:', headers);

  const cookies = headers['set-cookie'];
  console.log('Cookies:', cookies);

  if (!cookies) {
    throw new Error('No set-cookie header found in the response');
  }

  // Ensure cookies is an array
  const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];

  // Join cookies into a single string
  const cookiesString = cookiesArray.join('; ');

  const csrfTokenMatch = cookiesString.match(/csrftoken=([^;]+)/);
  const sessionIdMatch = cookiesString.match(/sessionid=([^;]+)/);

  if (!csrfTokenMatch || !sessionIdMatch) {
    throw new Error('CSRF token or session ID not found in the cookies');
  }

  const csrfToken = csrfTokenMatch[1];
  const sessionId = sessionIdMatch[1];

  // Step 2: Send a POST request to submit the pre-login form
  const preLoginResponse = await apiContext.post('https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/?_=1731316690108', {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Cookie': `csrftoken=${csrfToken}; sessionid=${sessionId}`
    },
    form: {
      csrfmiddlewaretoken: csrfToken,
      'log_in_view-current_step': 'pre_log_in_form',
      'pre_log_in_form-email': email
    }
  });

  // Step 3: Send a final POST request to complete the login
  const loginResponse = await apiContext.post('https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/?_=1731316690108', {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Cookie': `csrftoken=${csrfToken}; sessionid=${sessionId}`
    },
    form: {
      csrfmiddlewaretoken: csrfToken,
      'log_in_view-current_step': 'normal_log_in_form',
      'normal_log_in_form-username': email,
      'normal_log_in_form-password': password
    }
  });

  // Check if the login was successful
  expect(loginResponse.ok()).toBeTruthy();

  // Store the authentication token in the local storage
  await page.addInitScript(token => {
    window.localStorage.setItem('authToken', token);
  }, sessionId);

  // Navigate to the dashboard page
  await page.goto('https://ucl-coolab-dev.uk.r.appspot.com/dashboard');

  // Verify successful login
  await expect(page).toHaveURL('https://ucl-coolab-dev.uk.r.appspot.com/dashboard');
  await expect(page.getByText('Welcome back')).toBeVisible();
});