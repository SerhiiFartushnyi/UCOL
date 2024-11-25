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

// Shapes Options Applying
test('Upload Options Applying', async ({ page }) => {
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
    await page.waitForSelector('#create-template');
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible();
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.pause(1000);
    const uploadsButton = page.getByRole('button', { name: 'Uploads', exact: true })

    await expect(uploadsButton).toBeVisible({ timeout: 10000 });
    await uploadsButton.click({ timeout: 1000 });

    // Assertion of Uploads Page
    await expect(page.locator('section').filter({ hasText: 'Uploads' })).toBeVisible({timeout:10000 });
    await expect(page.locator('#asset-library-content')).toBeVisible({timeout:10000 });

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.pause(1000);

    if (await page.getByText('No Elements').isVisible()) {
        console.log('No Uploads');
    } else {
        await page.waitForSelector('#asset-library-content button');
        const noOfUploads = page.locator('#asset-library-content button');
        const numberOfUploads = await noOfUploads.count();
        console.log(`Number of Uploads: ${numberOfUploads}`);

        // Click on random Upload
        const randomUploadIndex = Math.floor(Math.random() * numberOfUploads);
        await noOfUploads.nth(randomUploadIndex).click();
        console.log(`Clicked on upload at index: ${randomUploadIndex}`);
    }

    //Search button
    await expect(page.getByPlaceholder('Search …')).toBeVisible({timeout:10000 });

    // Close button
    await expect(page.locator('button[aria-label="Close"]').first()).toBeVisible({timeout:10000 });
   

    // Add File button
    await expect(page.getByRole('button', { name: 'Add File' })).toBeVisible({timeout:10000 });

    // X button functionallity
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Uploads' })).not.toBeVisible();

    // Click on Upload button again
    await uploadsButton.click();

    // click on random upload
    const noOfUploads = page.locator('#asset-library-content button');
    const numberOfUploads = await noOfUploads.count();
    const randomUploadIndex = Math.floor(Math.random() * numberOfUploads);
    await noOfUploads.nth(randomUploadIndex).click();

    await expect(page.getByText('Element', { exact: true })).toBeVisible({ timeout: 10000 });

    // Choose random file >> Array of file paths

    const filePaths = [
        '/Users/serhiifartushnyi/Downloads/473c3f48-646d-40fd-828d-501e2a86daa5.jpeg',
        '/Users/serhiifartushnyi/Downloads/MB-eCitaro_Paya.jpg',
        '/Users/serhiifartushnyi/Downloads/Art-PNG-Clipart.png'
    ];

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * filePaths.length);

    // Get the file path at the random index
    const randomFilePath = filePaths[randomIndex];

    // Click the 'Add File' button to trigger the file input
    await page.getByRole('button', { name: 'Add File' }).click();

    // Locate the specific hidden file input element and set the input files
    await page.locator('input[type="file"][name="Upload"]').setInputFiles(randomFilePath);

    console.log(`Uploaded file: ${randomFilePath}`);

    // Check for 201 status code response
    const response = await page.waitForResponse(response => response.status() === 201);
    expect(response.status()).toBe(201);
});