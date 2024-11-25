import { test, expect } from '@playwright/test';
const config = require('./config');
/*
BEGOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;

// Change Language
test ('Change Language', async ({ page }) => {
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
    
    //Assertions to check if the user is on Main Page
    await expect(page.locator('body')).toContainText('Design professional');

    // Attempt to click on the #language-toggler element directly

    //await page.waitForLoadState('networkidle'); //!!!WAIT FOR ALL RENDERED !!! WAIT FOR ALL NETWORK REQUESTS TO FINISHED 
    const languageToggler = page.locator('#language-toggler');
    await expect(languageToggler).toBeVisible({timeout: 10000});
    await languageToggler.click();

    //await page.waitForLoadState('networkidle')

    await page.locator('#language-dropdown').getByText('Español').click();

    //Accertion of the language change to Espaniol
    expect(page.url()).toContain('/?language=es');
    await expect(page.getByRole('navigation')).toContainText('aprender');

    //await page.waitForLoadState('networkidle');
    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible({timeout: 10000});
    await profileIcon.click();
    await expect(page.locator('#profile-container')).toContainText('Desconectar');
    
    // Click on the element with the text 'Desconectar'
    await page.getByRole('link', { name: 'Desconectar' }).click();

});

test('Change Language Not logged in User', async ({ page }) => {
    await page.goto('/');

    //Assertions  user is on main page
    await expect(page.locator('body')).toContainText('Design professional');

    // Attempt to click on the #language-toggler element directly
    //await page.waitForLoadState('networkidle'); //!!!WAIT FOR ALL RENDERED !!! WAIT FOR ALL NETWORK REQUESTS TO FINISHED 
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#language-toggler');
    const languageToggler = page.locator('#language-toggler');
    await expect(languageToggler).toBeVisible({timeout: 10000});
    await languageToggler.click();

    //await page.waitForLoadState('networkidle')
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    await page.locator('#language-dropdown').getByText('Português Brasileiro').click();

    //Accertion of the language change to Espaniol
    await expect(page.getByRole('navigation')).toContainText('aprender');
    await expect(page.locator('#profile')).toContainText('Conecte-se');
    expect(page.url()).toContain('/?language=pt-br');
});
