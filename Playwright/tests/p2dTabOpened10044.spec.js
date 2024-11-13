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

// p2d Tab Opened Functionallity !!!!
// WERY SLOW TEST :)

test('p2d Tab Opened', async ({ page }) => {
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

    //Click on the p2d tab
    await page.getByText('p2d').click();

    // Page assertions 
    await expect(page.getByText('What kind of social post are')).toBeVisible();
    await expect(page.getByPlaceholder('Write a prompt to create your')).toBeVisible();
    await expect(page.getByRole('img', { name: 'randomize' })).toBeVisible();
    await expect(page.getByRole('button', { hasText: 'start' })).toBeVisible();

    // Click on the randomize button
    await page.getByRole('img', { name: 'randomize' }).click();

    const inputField = page.getByPlaceholder('Write a prompt to create your');

    // Get the value of the input field
    const inputValue = await inputField.inputValue();

    // Assert that the value is not empty
    expect(inputValue).not.toBe('');

    // List of titles
    const titles = [
        'Design an Instagram Story for a wellness retreat.',
        'Design an Instagram Post Landscape for a tech gadget launch.',
        'Design a Twitter post for a virtual conference announcement.',
        'Design a Facebook post for a community fundraising event.',
        'Design a LinkedIn post for a new job opening in a marketing firm.',
        'Design a Pinterest Pin for a DIY home decor tutorial.',
        'Design a YouTube thumbnail for a cooking channel’s latest recipe.',
        'Design a TikTok cover for a travel vlog series.',
        'Design a Snapchat Geofilter for a city marathon.',
        'Design a Reddit post image for a gaming community’s new event.'
    ];

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * titles.length);

    // Get the random title
    const randomTitle = titles[randomIndex];

    // Fill the placeholder with the selected title
    await page.getByPlaceholder('Write a prompt to create your').fill(randomTitle);

    console.log(`Filled with: ${randomTitle}`);

    await page.getByRole('button', { name: 'start' }).click();
    // await expect(page.getByText('choosing design styles...')).toBeVisible();
    await expect(page.locator('.p2d-container--header--title')).toHaveText('choosing design styles...')
    await expect(page.locator('.p2d-container--header--title')).toHaveText('select your favorite style')

    // Locate the parent element
    const parentElement = page.locator('.p2d-container--content--generation-container button');

    // Count the child <div> elements
    const childButtonCount = await parentElement.count();

    // Assert that the count is exactly 3
    expect(childButtonCount).toBe(3);

    // Check if the elements are visible
    await expect(page.getByRole('button', { name: 'star select' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'reload restart' })).toBeVisible();

    // Restart the process
    await page.getByRole('button', { name: 'reload restart' }).click();
    await expect(page.locator('.p2d-container--header--title')).toHaveText('choosing design styles...')
    await expect(page.locator('.p2d-container--header--title')).toHaveText('select your favorite style')

    // Count the button elements and click on a random one
    const buttonCount = await parentElement.count();
    console.log(`Number of buttons: ${buttonCount}`);

    // Ensure there are buttons to click
    if (buttonCount > 0) {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * buttonCount);

        // Click on the button at the random index
        await parentElement.nth(randomIndex).click();

        console.log(`Clicked on button at index: ${randomIndex}`);
    } else {
        console.log('No buttons found in .p2d-container--content--generation-container');
    }
    // Check if User is redirected to Scene Page 
    expect(page.url()).toContain('/tool/studio/');

    await expect(page.locator('.p2d-container--header--title')).toHaveText('generating your design...')

    // Check if the user is redirected to the scene page
    await page.waitForFunction(() => location.href.includes('/tool/scene/'), { timeout: 60000 });
    expect(page.url()).toContain('/tool/scene/');

});