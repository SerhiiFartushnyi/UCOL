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

// Save button functionality
test('File Export Functionality', async ({ page }) => {
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
    await expect(page.locator('body')).toContainText('Design professional');

    //Click on the create template button
    const createTemplateButton = page.locator('#create-template');
    await expect(createTemplateButton).toContainText('start designing');
    await createTemplateButton.click();

    //await page.waitForSelector('#asset-library-content');
    await page.getByRole('button', { name: 'Templates' }).click();

    //await page.waitForLoadState('networkidle');
    // Locate all child buttons within the element with the ID 'asset-library-content'

    const buttons = page.locator('#asset-library-content button');
    const buttonsCount = await buttons.count();

    // Log the count of buttons
    console.log(`Number of child buttons: ${buttonsCount}`);

    if (buttonsCount > 0) {
        const randomIndex = Math.floor(Math.random() * buttonsCount);
        await buttons.nth(randomIndex).click();
        console.log(`Clicked on button at index: ${randomIndex}`);
    } else {
        console.log('No buttons found within #asset-library-content');
    }

    // Check if the undo button is disabled
    const undoButton = await page.getByRole('button', { name: "undo" });
    const isDisabled = await undoButton.evaluate(element => element.classList.contains('disabled'));

    console.log(`Is undo button disabled? ${isDisabled}`);

    await page.getByRole('button', { name: 'Shapes' }).click();

    const shapeButton = page.locator('#asset-library-content button');
    const shapeButtonsCount = await shapeButton.count();

    console.log(`Number of Shape buttons: ${shapeButtonsCount}`);

    const randomShapeIndex = Math.floor(Math.random() * shapeButtonsCount);
    await shapeButton.nth(randomShapeIndex).click();
    console.log(`Clicked Shape at index: ${randomShapeIndex}`);

    // Check if the undo button is enabled
    const undoButtonEnabled = await undoButton.evaluate(element => !element.classList.contains('disabled'));
    const isUndoButtonEnabled = await undoButtonEnabled;

    console.log(`Is undo button enabled? ${isUndoButtonEnabled}`);

    // // Click some buttons to change the design
    await page.getByLabel('Align left').click();
    await page.getByLabel('Align right').click();
    await page.getByLabel('Align center (vertical)').click();
    await page.getByLabel('Align bottom').click();
    await page.getByLabel('Selected blend mode: Normal').click();
    await page.getByRole('option', { name: 'Color Burn' }).click();
    await page.getByRole('button', { name: 'Position & Size' }).click();

    // Show more Options 
    await page.getByLabel('Show more options').click();

    // Array of button names
    const buttonNames = ['Export PNG', 'Export JPG', 'Export PDF'];

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * buttonNames.length);

    // Get the button name at the random index
    const randomButtonName = buttonNames[randomIndex];

    // Wait for the download event
    const downloadPromise = page.waitForEvent('download');

    // Click the button with the randomly selected name
    await page.getByRole('button', { name: randomButtonName }).click();

    console.log(`Clicked on button: ${randomButtonName}`);

    // Get the download object
    const download = await downloadPromise;

    // Get the suggested filename
    const suggestedFilename = download.suggestedFilename();

    // Check the file extension
    const fileExtension = suggestedFilename.split('.').pop();

    if (randomButtonName.includes('PNG')) {
        console.assert(fileExtension === 'png', `Expected .png but got .${fileExtension}`);
    } else if (randomButtonName.includes('JPG')) {
        console.assert(fileExtension === 'jpg', `Expected .jpg but got .${fileExtension}`);
    } else if (randomButtonName.includes('PDF')) {
        console.assert(fileExtension === 'pdf', `Expected .pdf but got .${fileExtension}`);
    } else {
        console.log(`Unexpected button name: ${randomButtonName}`);
    }
    console.log(`The downloaded file has a .${fileExtension} extension.`);
});