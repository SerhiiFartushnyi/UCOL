import { request } from '@playwright/test';
require('dotenv').config();

// Login to the site 

export async function login(page, email, password) {
  // Step 1: Load the login page and extract CSRF token
  await page.goto(`${process.env.BASE_URL}/modal/log-in/`);
  
  // Wait for CSRF token to be available
  const csrfToken = await page.getAttribute('input[name="csrfmiddlewaretoken"]', 'value');
  if (!csrfToken) {
    throw new Error('CSRF token not found on the login page');
  }

  // Step 2: Send the pre-login request with extracted CSRF token
  const preLoginResponse = await page.request.post(`${process.env.BASE_URL}/modal/log-in/`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': `${process.env.BASE_URL}/modal/log-in/`,
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

  // Step 3: Send the final login request
  const loginResponse = await page.request.post(`${process.env.BASE_URL}/modal/log-in/`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': `${process.env.BASE_URL}/modal/log-in/`,
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
}