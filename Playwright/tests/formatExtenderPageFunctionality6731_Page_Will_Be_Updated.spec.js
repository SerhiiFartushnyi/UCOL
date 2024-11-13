import { test, expect } from '@playwright/test';
import { time } from 'console';
import { timeout } from '../playwright.config';
const config = require('./config');

/* 
//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail1;
let password = config.password1;

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

test ('Features > Format Extender Page Functionallity', async ({ page }) => {

    // Go to Features and click Format Extender
    await page.getByText('features', { exact: true }).hover();
 
    await page.getByRole('link', { name: 'format extender' }).click();

    //Check format extender page and button 
    await expect(page.locator('body')).toContainText('create a whole set of designs in a few simple clicks');
    await expect(page.getByRole('link', { name: 'start now' }).first()).toBeVisible();
    await page.getByRole('link', { name: 'start now' }).first().click();

    // Check if we are on the Studio Page
    expect(page.url()).toContain('/tool/studio/');

    // wait for Loading Studio Page 
    await page.waitForLoadState('networkidle');

    // Choose Format Extender and click
    await expect(page.locator('#format-extender')).toContainText('format extender');
    await page.locator('#format-extender').click();

    // Choose random project 
    await page.waitForLoadState('networkidle');
    const containers = await page.locator('.project--image-container--image');
     const containerCount = await containers.count();
     const randomIndex3 = Math.floor(Math.random() * containerCount);
     await containers.nth(randomIndex3).click();

   // Click Next Button
    await page.getByRole('button', { name: 'next' }).click();

    // Choose format in Formats page (Randon from all existing formats)
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

    await page.waitForLoadState('networkidle');
    // Wait Untill Format was generated 
    await page.waitForTimeout(5000);

    // Check titles of the generated formats page 
   
    await expect(page.getByText('Select the generated options')).toContainText('Select the generated options you’d like to save to your project folder, or download them directly.');

    await expect(page.locator('#root')).toContainText('add more formats');
    await expect(page.locator('#root')).toContainText('Save');
    await page.getByRole('button', { name: /Save .*/ }).click();

    await expect(page.locator('#root')).toContainText('my projects');
    //const downloadPromise = page.waitForEvent('download');
    await page.getByText('download all').click();

    // const download = await downloadPromise;
    // await page.getByText('homeCampaign-1729771939-').click();
});

// Page will be Updated !!!!
test.skip ('Project > Format Extender Page Functionality', async ({ page }) => {

    // Check if the user is logged in
   const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible();
    await profileIcon.click();
    
    // Go to Projects and click Format Extender
    await page.goto('/projects/');
    await page.locator('#ui-id-2').click();

    await page.getByRole('button', { name: 'extend format' }).click();

    // await page.waitForLoadState('networkidle');
    // await page.waitForSelector('.formats-container--dropdown--formats--option--checkbox');
    // // const containers = page.locator('[class="infinite-item selection-area-el flex flex-col w-[186px] h-fit sm:w-full border-[#e5e5e5] border-solid border-2"]');
    // // const containers = page.locator('#project-item-container .w-\\[85\\%\\]');
    //await page.waitForSelector('#projects-container #project-item');

    //await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for 5000 milliseconds (5 seconds)
    const containers = page.locator('#projects-container #project-item');

     console.log(containers, ' Format Extender item');

    const containerCount = await containers.count();
    console.log(containerCount, ' Counted items');
 
    const randomIndex3 = Math.floor(Math.random() * containerCount);
    await containers.nth(randomIndex3).click();

    await page.getByRole('button', { name: 'next' }).click();
    
    // Choose format in Formats page (Random from all existing formats)

    // Get all the checkboxes
    const checkboxes = await page.locator('.format-checkbox');
    const checkboxCount = await checkboxes.count();
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * checkboxCount);
    // Check the checkbox at the random index
    await checkboxes.nth(randomIndex).check();

    // Waiting for the formats to be generated
    await page.getByRole('button', { name: 'generate' }).click();
    await expect(page.locator('#format-extender-tab-content')).toContainText('generating formats...');
    await page.waitForTimeout(8000);

    // Check titles of the generated formats page
    await expect(page.locator('#format-extender-tab-content')).toContainText('add more formats');
    
    //await expect(page.locator('#save-formats-btn')).toContainText('save (1) formats');
    await expect(page.locator('#save-formats-btn')).toContainText(/save .*/);

    //await page.getByRole('button', { name: 'save (1) formats' }).click();
    await page.getByRole('button', { name: /save .*/ }).click();

    await expect(page.locator('#format-extender')).toContainText('Format Extender');

    await page.getByRole('button', { name: 'save ' }).click();
    await expect(page.locator('#format-extender')).toContainText('Format Extender');
});
