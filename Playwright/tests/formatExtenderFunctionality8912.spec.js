//Updated:13Nov24
import { test, expect } from '@playwright/test';
import config from './config';

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;

//Format Extender Tab Opening 
test ('Format Extender Tab Opening', async ({ page }) => {
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
    await page.goto('/tool/studio/');
    await expect(page.getByText('my projects')).toBeVisible();

//     // const projects = await page.locator('.infinite-scroll-component .studio-project-item')
//     // const projectCount = await projects.count();

//     // const randomProjectIndex = Math.floor(Math.random() * projectCount);
//     // console.log('randomProjectIndex', randomProjectIndex);
//     // await projects.nth(randomProjectIndex).click();

//     await page.waitForSelector('.infinite-scroll-component .studio-project-item');
//     const projects = page.locator('.infinite-scroll-component .studio-project-item');
//     const projectCount = await projects.count();

// if (projectCount > 0) {
//   const randomProjectIndex = Math.floor(Math.random() * projectCount);
//   console.log('randomProjectIndex', randomProjectIndex);
//   await projects.nth(randomProjectIndex).click({ button: 'right' });

// } else {
//   console.log('No projects found');
// }
// await page.getByRole('button', { name: 'ai format extender' }).click();

await page.locator('#format-extender').getByText('format extender').click();

await page.waitForSelector('.projects-content--projects-container .project');

const project = await page.locator('.projects-content--projects-container .project')
const projectsCount = await project.count();
console.log('projectsCount', projectsCount);
const randomProjectIndex = Math.floor(Math.random() * projectsCount);
console.log('randomProjectIndex', randomProjectIndex);
await project.nth(randomProjectIndex).click();

await page.getByRole('button', { name: 'next' }).click();

// Get all the checkboxes
await page.waitForSelector('.formats-container--dropdown--formats--option--checkbox');
const checkboxes = await page.locator('.formats-container--dropdown--formats--option--checkbox');
// Get the count of checkboxes

const checkboxCount = await checkboxes.count();
console.log(checkboxCount, 'checkbox count');

// Generate a random index
const randomIndex = Math.floor(Math.random() * checkboxCount);
// Check the checkbox at the random index
await checkboxes.nth(randomIndex).check();
console.log(randomIndex, 'checkbox checked');

await page.getByRole('button', { name: 'next' }).click();
await expect(page.locator('#root')).toContainText('creating formats...');
await page.waitForTimeout(10000);


await expect(page.getByRole('heading')).toContainText('3/ pick your design(s)');

const download3Promise = page.waitForEvent('download');
await page.getByRole('button', { name: 'download Download' }).click();
const download3 = await download3Promise;

// Wait for the page to load completely
await page.waitForLoadState('networkidle');

// Click the "Save (1) formats" button
// await page.getByRole('button', { name: 'Save (1) formats' }).click();

// // Intercept and check the POST request
// const [response] = await Promise.all([
//   page.waitForResponse('https://ucl-coolab-dev.uk.r.appspot.com/api/helpers/format-extender/316/save/'),
//   page.getByRole('button', { name: 'Save (1) formats' }).click()
// ]);

// // Check if the response status is 200
// expect(response.status()).toBe(200);

//  Click on the save button
await page.getByRole('button', { name: 'Save (1) formats' }).click();

// Wait for the response and assert the status code
const response = await page.waitForResponse(response => response.url().includes('/save/') && response.request().method() === 'POST');
    
// Check if the response status is 200
expect(response.status()).toBe(2001);

// await page.getByRole('button', { name: 'add more formats' }).click();
});