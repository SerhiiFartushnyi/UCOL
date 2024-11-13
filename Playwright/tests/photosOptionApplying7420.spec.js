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

// Photos Options Applying
test('Photos Options Applying', async ({ page }) => {
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

    //Click on the create template button
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible();
    await startDesigning.click();

    await page.waitForLoadState('networkidle');
    const photosButton = page.getByRole('button', { name: 'Photos', exact: true })

    await expect(photosButton).toBeVisible();
    await photosButton.click({ timeout: 1000 });

    // Assertion of Photos Page
    await expect(page.locator('section').filter({ hasText: 'Photos' })).toBeVisible();
    await expect(page.locator('#asset-library-content')).toBeVisible();

    await page.waitForLoadState('networkidle');
    const noOfPhotos = page.locator('#asset-library-content button')
    const numberOfPhotos = await noOfPhotos.count();

    console.log(`Number of images: ${numberOfPhotos}`);

    //Click on random image
    const randomPhotoIndex = Math.floor(Math.random() * numberOfPhotos);
    await noOfPhotos.nth(randomPhotoIndex).click();

    console.log(`Clicked on image at index: ${randomPhotoIndex}`);

    // Remove wirst randomly  the selected photo
    await page.getByLabel('Undo').click();

    //Search for not existing photo
    await page.getByPlaceholder('Search …').click();
    await page.getByPlaceholder('Search …').fill('064dridjwl');
    await page.getByPlaceholder('Search …').press('Enter');
    await page.getByPlaceholder('Search …').clear();

    // Search for a existing format 
    const photosNames = ['man', 'flower', 'bookr', 'ocean', 'water', 'ball', 'moon', 'car', 'audi', 'horror', 'birthday'];

    const randomName = photosNames[Math.floor(Math.random() * photosNames.length)]
    
//     // Chose a random picture based on provided requests 
    await page.getByPlaceholder('Search …').click();
    await page.getByPlaceholder('Search …').fill(randomName);
    await page.getByPlaceholder('Search …').press('Enter');
    console.log(`Searching for ${randomName} picture`);

    
   // Get the count of photos  after the search

   const noOfPhotos2 = page.locator('#asset-library-content button')

    const numberOfPhotos2 = await noOfPhotos2.count();
    console.log(`Number of images: ${numberOfPhotos2}`);

    // Click on random image
    const randomPhotoIndex2 = Math.floor(Math.random() * numberOfPhotos2);
    await noOfPhotos2.nth(randomPhotoIndex2).click();
    console.log(`Clicked on image at index: ${randomPhotoIndex2}`);

    // //Click on X button to close the Formats panel
    await page.locator('button[name="panel\\.close\\.\\/\\/ly\\.img\\.panel\\/assetLibrary"]').click();
    await expect(page.locator('section').filter({ hasText: 'Photos' })).not.toBeVisible();

    await page.getByLabel('Undo').click();
});