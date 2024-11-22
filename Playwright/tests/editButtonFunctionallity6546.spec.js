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
let password = config.password1;

test('Edit Button Functionallity', async ({ page }) => {
    
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

    // Check if the user is logged in
    //await page.waitForLoadState('networkidle');

    const profileIcon = page.locator('#profile-toggler-container');
    await page.waitForSelector('#profile-toggler-container');
    await expect(profileIcon).toBeVisible();
    await profileIcon.click();

    // Click on Project Button
    const projectButton = await page.getByRole('link', { name: 'Go to Projects' });
    await expect(projectButton).toBeVisible();
    await projectButton.click();
    
   // Go to Projects and click on first project
    //await page.waitForLoadState('networkidle');
    await expect(page.locator('#projects-container')).toContainText('Edit');
    
    // Check if the dark theme button exists
const darkThemeButton = page.locator('.edit-btn-container-darkened').first();
const normalThemeButton = page.locator('.edit-btn-container').first();

if (await darkThemeButton.count() > 0) {
    // Click the dark theme button if it exists
    await darkThemeButton.click();
} else {
    // Click the normal theme button if the dark theme button does not exist
    await normalThemeButton.click();
}
    //await page.waitForLoadState('networkidle');
    // Check if the user Pedirected to The Scene Page and Project is opened
    expect(page.url()).toContain('/tool/scene');

    //await page.waitForLoadState('networkidle');
    await expect(page.locator('[id="projectBtn\\""]')).toContainText('Projects');
    await expect(page.locator('button[name="librarydock-my-templates-entry"]')).toContainText('Templates');
    await expect(page.locator('#root')).toContainText('Feedback');

});