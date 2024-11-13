// Updated:13Nov24
import { test, expect } from '@playwright/test';
import config from './config';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state

test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;

// Change replace Status Button Functionallity
test('Change replace Status Button Functionallity ', async ({ page }) => {
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

    // Go To Scene Tab
    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    await page.getByRole('link', { name: 'start now' }).first().click();

    //Click on the Layers tab
    await page.locator('#layers').click();
    await expect(page.locator('.genre-assets-topbar--title')).toContainText('layers');

    await page.waitForLoadState('networkidle');
    const layersComponent = page.locator('#scrollableDiv .genre-assets-content--content--assets-container--asset')
    const numberOfLayers = await layersComponent.count();
    console.log('numberOfLayers counted: ', numberOfLayers);
    const randomLayerIndex = Math.floor(Math.random() * numberOfLayers);
    const randomLayer = layersComponent.nth(randomLayerIndex);

    console.log('clicked on randomLayerIndex: ', randomLayerIndex);
    await randomLayer.click();

    // Assertion to check if layer set as replaceable/replaceable
    await page.getByText('change replaceable status').click();
    await expect(page.getByText(/New assets set as (irreplaceable|replaceable)/)).toBeVisible();

    await randomLayer.click();

    // Assertion to check if layer set as irreplaceable or replaceable
    await page.getByText('change replaceable status').click();
    await expect(page.getByText(/New assets set as (irreplaceable|replaceable)/)).toBeVisible();

    //Check multiple layers ???
});

