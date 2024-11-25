import { test, expect } from '@playwright/test';
import { profile } from 'console';
const config = require('./config');

/* 
//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail1;
const password = config.password1;
const firstName = config.firstName;
const lastName = config.lastName;

test.beforeEach(async ({ page }) => {
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
});

test('Profile popup', async ({ page }) => {

    // Check if the user is logged in
    await expect(page.locator('#profile-toggler')).toBeVisible({timeout: 10000});
    //await page.waitForLoadState('networkidle');
    await page.waitForSelector('#profile-toggler');
    await page.locator('#profile-toggler').click();
    
    //await page.waitForLoadState('networkidle');
   
    // Check Profile information
    await page.waitForSelector('#profile-container');
    const profile = await page.locator('#profile-container');
    await expect(profile).toContainText(`${firstName} ${lastName}`);
    await expect(profile).toContainText(email);
    

    // Check text in Popup Window 
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();

});

test('Profile Information', async ({ page }) => {
    //await page.waitForSelector('img', { name: 'Avatar profile' });
    await expect(page.locator('#profile-toggler')).toBeVisible({timeout: 10000});
    //await page.waitForLoadState('networkidle');
    //await page.getByRole('img', { name: 'Avatar profile' }).click();
    await page.locator('#profile-toggler').click();

    // Check text in Popup Window 
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible({timeout: 10000});
    await page.getByRole('link', { name: 'Go to Account Settings' }).click();

    // Check text in Account Settings
    await expect(page.locator('#account-section')).toContainText('Manage your account information');

    // Check User's Full Name 
    await expect(page.locator('#full_name')).toContainText(`${firstName} ${lastName}`);
    await expect(page.getByRole('link', { name: 'dariya.bochulya@coaxsoft.com' })).toHaveText(email);

    // Recall Profile Popup 
    await page.locator('#update-profile-info-modal-trigger-btn').click();      

    //Check Account Upadte Info Popup Fields
    await expect(page.locator('#update-profile-info-modal')).toContainText('update profile');

    await expect(page.locator('input[name="first_name"]')).toHaveValue(`${firstName}`);
    await expect(page.locator('input[name="last_name"]')).toHaveValue(`${lastName}`);

    //await expect(page.locator('input[name="username"]')).toHaveValue(mail);

    await page.locator('#update-profile-info-modal').getByText('cancel').click();

});

test('Profile >> Go to Progects Page', async ({ page }) => {

    // Check if the user is logged in
    //await page.waitForSelector('img', { name: 'Avatar profile' });
    await expect(page.locator('#profile-toggler')).toBeVisible({timeout: 10000});
    //await page.waitForLoadState('networkidle');
    //await page.getByRole('img', { name: 'Avatar profile' }).click();
    await page.locator('#profile-toggler').click();

    // Check Profile information
    await expect(page.locator('#profile-container')).toContainText(`${firstName} ${lastName}`);
    await expect(page.locator('#profile-container')).toContainText(email);

    // Check text in Popup Window

    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible({timeout: 10000});
    await page.getByRole('link', { name: 'Go to Projects' }).click();

    // Check if the user is on the Projects Page
    await expect(page.url()).toContain('/projects/');
    await expect(page.locator('#projects-tabs')).toContainText('DEVELOPER');
    await expect(page.getByRole('heading')).toContainText('Projects');
    await expect(page.locator('#add-new-project-btn')).toContainText('new design');
});
 