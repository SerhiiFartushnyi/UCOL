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

// Format Options Applying
test.skip ('Formats Options Applying', async ({ page }) => {
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
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
        }

    //Click on the create template button
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible({ timeout: 10000 });
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
        }
    const formatButton = page.getByRole('button', { name: 'Formats' })
    await expect(formatButton).toBeVisible({ timeout: 10000 });
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
        }
    await formatButton.click({ timeout:10000 });

    // Assertion of Formats Page 
    await expect(page.locator('section').filter({ hasText: 'Formats' })).toBeVisible();
    await expect(page.locator('#formats-container')).toBeVisible();


    //Search for a template Not existing Search request
    await page.getByPlaceholder('Search ...').click();
    await page.getByPlaceholder('Search ...').fill('tik-tok');
    await page.getByPlaceholder('Search ...').press('Enter');
    await expect(page.getByText('No Elements')).toBeVisible({timeout: 10000});
    await page.getByPlaceholder('Search ...').clear();

    // // Search for a existing format Hardcoded
     const formats = ['instagram', 'facebook', 'twitter', 'linkedin', 'pinterest', 'tiktok', 'youtube', 'snapchat', 'twitch', 'print', 'clothing'];
     const randomFormat = formats[Math.floor(Math.random() * formats.length)]
    
    // Chose a random format 
    await page.getByPlaceholder('Search ...').click();
    await page.getByPlaceholder('Search ...').fill(randomFormat);
    await page.getByPlaceholder('Search ...').press('Enter');
    console.log(`Searching for ${randomFormat} format`);

    // Get the count of buttons after the search
    await page.waitForSelector('#formats-container button');
    const buttons = page.locator('#formats-container button', { hasText: randomFormat });
    const buttonCount = await buttons.count();
    console.log(`Number of buttons: ${buttonCount}`);

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * buttonCount);

    // Click on the button at the random index
    await buttons.nth(randomIndex).click("Enter");

    console.log(`Clicked on button at index: ${randomIndex}`);
    await page.getByPlaceholder('Search ...').clear();

    // //Click on X button to close the Formats panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Formats' })).not.toBeVisible();

    //Click on the random Formats button
    await page.getByRole('button', { name: 'Formats' }).click();

    const formatButtons = page.locator('#formats-container button');
    const buttonsCounted2 = await formatButtons.count();

    // Log the count of buttons
    console.log(`Number of child buttons: ${buttonsCounted2}`);

    if (buttonsCounted2 > 0) {
        const randomIndex2 = Math.floor(Math.random() * buttonsCounted2);

    // Click on a random Template button
        await formatButtons.nth(randomIndex2).click();

        console.log(`Clicked on the Style at index: ${randomIndex2}`);
    } else {
        console.log('No buttons found within #asset-library-content');
    }

    // !!!  Get the text of each button >> Made at formatOptionsApplying7418_2.spec.js
    // This code should be refactored  Part with the button text extraction
    // should be added to top of the test

//     const buttonTexts = new Set();

// // Iterate over each button to extract the text
// for (let i = 0; i < buttonsCounted2; i++) {
//   const buttonText = await formatButtons.nth(i).locator('div > p').last().innerText();
//   buttonTexts.add(buttonText);
// }
// const uniqueButtonTextsArray = Array.from(buttonTexts);

// console.log('Button texts:', uniqueButtonTextsArray);
});