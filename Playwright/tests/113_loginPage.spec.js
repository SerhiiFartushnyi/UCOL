import { test, expect } from '@playwright/test';

const email = 'serhii.fartushnyi+eg@coaxsoft.com';
const password = 'Qwert12345!';
test.use({ storageState: 'auth.json' });


test('Extract dynamic parameter after login click and use in GET request', async ({ page, context }) => {
  // Step 1: Navigate to the login page
  await page.goto('/');

  // Step 2: Set up network interception to capture the dynamic URL in the GET request
  const [request] = await Promise.all([
    // Intercept the network request and capture the updated URL
    page.waitForRequest((request) => request.url().includes('?_=')),
    
    // Click the 'log in' button to trigger the dynamic URL update
    page.locator('#profile').getByRole('paragraph').getByText('log in').click()
  ]);

  // Step 3: Capture the dynamic parameter from the intercepted GET request URL
  const updatedUrl = request.url();  // Get the updated URL after clicking login
  console.log('Captured URL with dynamic parameter:', updatedUrl);

  // Step 4: Extract the dynamic parameter (?_=1731316690108)
  const dynamicParam = updatedUrl.split('?_=')[1];
  if (!dynamicParam) {
    throw new Error('Dynamic parameter not found in the URL');
  }

  console.log('Extracted dynamic parameter:', dynamicParam);

  // Step 5: Extract CSRF token from the page
  const csrfToken = await page.getAttribute('input[name="csrfmiddlewaretoken"]', 'value');
  if (!csrfToken) {
    throw new Error('CSRF token not found on the login page');
  }

  console.log('Extracted CSRF Token:', csrfToken);

  // Step 6: Send the pre-login GET request using the extracted dynamic parameter
  const preLoginResponse = await page.request.get(`https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/?_=${dynamicParam}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
    }
  });

  if (!preLoginResponse.ok()) {
    throw new Error('Pre-login GET request failed');
  }

  console.log('Pre-login GET request successful');

  // Step 7: Send the final login POST request using the extracted CSRF token and dynamic parameter
  const loginResponse = await page.request.post(`https://ucl-coolab-dev.uk.r.appspot.com/modal/log-in/?_=${dynamicParam}`, {
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

  console.log('Login successful');

  // Step 8: Navigate to the dashboard page and verify successful login
  await page.goto('/dashboard');
  await expect(page).toHaveURL('https://ucl-coolab-dev.uk.r.appspot.com/dashboard');
  await expect(page.locator('text=Welcome back')).toBeVisible();
});