import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Login Button Functionality
test('Login button', async ({ page }) => {

    await page.goto('/');

    // Visual Test Main Page
    await expect(page.getByText('Design professional')).toBeVisible({ timeout: 10000 });
    const loginButton = page.locator('#profile').getByRole('paragraph').getByText('log in');
    await expect(loginButton).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('sign up')).toBeVisible({ timeout: 10000 });
    await loginButton.click();

    // Visual Test Login Modal
    const loginPopup = page.locator('#auth-modal-content');
    expect(loginPopup).toBeVisible();
    await expect(loginPopup).toContainText('log in to start creating');
    await expect(loginPopup).toContainText('No account? Sign up');
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible({});

});