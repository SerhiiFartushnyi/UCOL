import { test, expect } from '@playwright/test';
import config from './config';
import { beforeEach } from 'node:test';

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js  to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;

test.beforeEach(async ({ page }) => {
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
});

//Format Extender Tab Opening Download and Save Button Functionallity
test('Format Extender > Download and Save Button Functionallity', async ({ page }) => {
    test.slow();

    // Navigate to site  
    await page.goto('/tool/studio/');
    await expect(page.getByText('my projects')).toBeVisible();

    // Click on the format extender tab
    await page.locator('#format-extender').getByText('format extender').click();

    // Wait for the projects to load
    await page.waitForSelector('.projects-content--projects-container .project');

    // Get all the projects
    const project = await page.locator('.projects-content--projects-container .project')
    const projectsCount = await project.count();
    console.log('projectsCount', projectsCount);
    const randomProjectIndex = Math.floor(Math.random() * projectsCount);
    console.log('randomProjectIndex', randomProjectIndex);

    // Click on a random project
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
    await page.locator('.generated-page-formats-container--page-format--image-container').waitFor();
    //await page.waitForTimeout(20000);

    // Check if page is loaded
    await expect(page.getByRole('heading')).toContainText('3/ pick your design(s)');

    const downloadPromise = page.waitForEvent('download');

    // Trigger the download action
    await page.getByRole('button', { name: 'download Download' }).click();

    // Wait for the download to start and complete
    const download = await downloadPromise;

    // Save the file to a local path
    const savePath = './downloads/my-download-file.ext';
    await download.saveAs(savePath);

    console.log(`Download was successful. File saved to: ${savePath}`);

    // Optionally, verify the file exists and check its contents
    const fs = require('fs');
    if (fs.existsSync(savePath)) {
        console.log('File exists!');
        const fileContent = fs.readFileSync(savePath, 'utf-8');
        // console.log('Downloaded file content:', fileContent);
    } else {
        console.error('Failed to save the download.');
    }

    // Wait for the page to load completely
    //await page.waitForLoadState('networkidle');

    //  Click on the save button
    await page.getByRole('button', { name: 'Save (1) formats' }).click();

    // Wait for the response and assert the status code
    const response = await page.waitForResponse(response => response.url().includes('/save/') && response.request().method() === 'POST');

    // Check if the response status is 200 
    expect(response.status()).toBe(200);

});

test('Format Extender > Edit Button Functionallity', async ({ page }) => {
    test.slow();

    // Navigate to site  
    await page.goto('/tool/studio/');
    await expect(page.getByText('my projects')).toBeVisible();

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
    await page.locator('.generated-page-formats-container--page-format--image-container').waitFor();
    //await page.waitForTimeout(20000);

    // Check if page is loaded
    await expect(page.getByRole('heading')).toContainText('3/ pick your design(s)');

    // Click on the Edit button
    await page.getByRole('button', { name: 'edit Edit' }).click();

    expect(page.url()).toContain('/tool/scene/');

    await page.goto('/tool/studio/');

    await page.locator('#format-extender').click();
    await page.getByRole('button', { name: 'Save (1) formats' }).click();

});

test('Format Extender > Add More Formats Button Functionallity', async ({ page }) => {
    test.slow();

    // Navigate to site  
    await page.goto('/tool/studio/');
    await expect(page.getByText('my projects')).toBeVisible();


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
    await page.locator('.generated-page-formats-container--page-format--image-container').waitFor();
    //await page.waitForTimeout(20000);

    // Check if page is loaded
    await expect(page.getByRole('heading')).toContainText('3/ pick your design(s)');

    // Click on the Add more formats button
    await page.getByRole('button', { name: 'add more formats' }).click();

    // Verify that the user is taken back to the formats selection screen
    expect(page.url()).toContain('/tool/studio/');
    await expect(page.getByRole('heading', { name: 'format extender' })).toBeVisible();

    await page.locator('#format-extender').getByText('format extender').click();

});

test('Clear Format Extender ', async ({ page }) => {
    test.slow();
    
    // Navigate to site  
    await page.goto('/tool/studio/');
    await expect(page.getByText('my projects')).toBeVisible();

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
    await page.locator('.generated-page-formats-container--page-format--image-container').waitFor();
    // //await page.waitForTimeout(20000);

    // Check if page is loaded
    await expect(page.getByRole('heading')).toContainText('3/ pick your design(s)');

    await page.getByRole('button', { name: /Save \(\d+\) formats/ }).click();

    // Wait for the response and assert the status code
    const response = await page.waitForResponse(response => response.url().includes('/save/') && response.request().method() === 'POST');

    // Check if the response status is 200 
    expect(response.status()).toBe(200);

});

