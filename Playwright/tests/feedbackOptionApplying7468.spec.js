import { test, expect } from '@playwright/test';
import config from './config';
import { faker } from '@faker-js/faker';

/*
BEGOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

//Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;
const randomWords = faker.lorem.words();

//Feedback Options Applying
test ('Feedback Options Applying', async ({ page }) => {
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

    //await page.waitForLoadState('networkidle');

    //Click on the create template button
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible();
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    const textButton = page.getByRole('button', { name: 'help Feedback', exact: true })

    await expect(textButton).toBeVisible();
    await textButton.click();

    // Assertions of Feedback Popup
    await expect(page.getByRole('heading', { name: 'Give us some Feedback!' })).toBeVisible();
    await expect(page.getByText('Suggest a feature')).toBeVisible();
    await expect(page.getByPlaceholder('How can we improve our app?')).toBeVisible();
    await expect(page.getByText('include a screenshot of your')).toBeVisible();
    await expect(page.getByRole('button', { name: 'send' })).toBeVisible();

    // Fill feedback without option chosen
    const feedback = await page.getByPlaceholder('How can we improve our app?');
    await feedback.click();
    await feedback.fill(randomWords);
    await page.getByRole('button', { name: 'send' }).click();
    await expect(page.getByText('Dropdown option is required')).toBeVisible();
    await page.getByPlaceholder('How can we improve our app?').clear();
    
    // Fill feedback with option chosen and no text
    //   !!!!!   Should be improved regarding to Feedback options on PROD
    await page.getByText('Suggest a feature').click();
    await page.getByText('bug', { exact: true }).click();
    await page.getByRole('button', { name: 'send' }).click();
    await expect(page.getByText('Is required. Max length is')).toBeVisible();

    // Fill feedback with option chosen on previouse test and text
    const feedback2 = await page.getByPlaceholder('How can we improve our app?');
    await feedback2.click();
    await feedback2.fill(randomWords);
    await page.getByRole('button', { name: 'send' }).click();

    await expect(page.getByRole('heading', { name: 'feedback has been sent!' })).toBeVisible();
    await page.getByRole('button', { name: 'ok', exact: true }).click();

    await page.goto('/admin/upc/feedback/');
    //await page.waitForLoadState('networkidle');
    await expect(page.locator('#result_list')).toContainText(randomWords);
});