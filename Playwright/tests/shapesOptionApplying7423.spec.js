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

// Shapes Options Applying
test('Shapes Options Applying', async ({ page }) => {
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
    await page.pause(1000);
    const photosButton = page.getByRole('button', { name: 'Shapes', exact: true })

    await expect(photosButton).toBeVisible();
    await photosButton.click({ timeout: 1000 });

    // Assertion of Shape Page
    await expect(page.locator('section').filter({ hasText: 'Shapes' })).toBeVisible();
    await expect(page.locator('#asset-library-content')).toBeVisible();

    // await page.waitForLoadState('networkidle');
    // await page.pause(1000);

    await page.waitForSelector('#asset-library-content button');
    const noOfShapes= page.locator('#asset-library-content button')
    const numberOfShapes = await noOfShapes.count();

    console.log(`Number of shapes: ${numberOfShapes}`);

    //Click on random Shape
    const randomShapeIndex = Math.floor(Math.random() * numberOfShapes);
    await noOfShapes.nth(randomShapeIndex).click();

    console.log(`Clicked on shape at index: ${randomShapeIndex}`);

    // Check for error and retry if necessary
    const errorHeading = page.getByRole('heading', { name: 'Error Applying Asset' });

    if (await errorHeading.count() > 0 && await errorHeading.isVisible()) {
        const backButton = page.getByRole('button', { name: 'Back', exact: true });
        console.log('Error applying asset, retrying with another shape...');
        await backButton.click();
        const newRandomShapeIndex = Math.floor(Math.random() * numberOfShapes);
        await noOfShapes.nth(newRandomShapeIndex).click();
        console.log(`Clicked on shape at index: ${newRandomShapeIndex}`);
    }

    await expect(page.locator('#ubq-headline_label')).toContainText('Element');

    // Remove first randomly  selected Shape
    await page.getByLabel('Undo').click();

    //Search for not existing photo
    await page.getByPlaceholder('Search …').click();
    await page.getByPlaceholder('Search …').fill('064dridjwl');
    await page.getByPlaceholder('Search …').press('Enter');
    await page.getByPlaceholder('Search …').clear();

//     // Search for a existing Shape
 const shapesNames = ['star', 'arrow', 'circle', 'robot', 'rectangle','halfcircle'];
 const randomShape = shapesNames[Math.floor(Math.random() * shapesNames.length)]
    
   // Chose a random Shape based on provided requests 
   await page.getByPlaceholder('Search …').click();
  await page.getByPlaceholder('Search …').fill(randomShape);
   console.log(`Searching for ${randomShape} shape`);

   // Get the count of Shape after the search
   const noOfShapes2 = page.locator('#asset-library-content button')

    const numberOfShapes2 = await noOfShapes2.count();
    console.log(`Number of images: ${numberOfShapes2}`);

    // Click on random Shape
    const randomShapeIndex2 = Math.floor(Math.random() * numberOfShapes2);
    await noOfShapes2.nth(randomShapeIndex2).click();
    console.log(`Clicked on shape at index: ${randomShapeIndex2}`);

    // Check for error and retry if necessary
    const errorHeading2 = page.getByRole('heading', { name: 'Error Applying Asset' });

    if (await errorHeading2.count() > 0 && await errorHeading2.isVisible()) {
        const backButton2 = page.getByRole('button', { name: 'Back', exact: true });
        console.log('Error applying asset, retrying with another shape...');
        await backButton2.click();
        const newRandomShapeIndex2 = Math.floor(Math.random() * numberOfShapes2);
        await noOfShapes2.nth(newRandomShapeIndex2).click();
        console.log(`Clicked on shape at index: ${newRandomShapeIndex2}`);
    }
    // Check if the Shape is applied
    await expect(page.locator('#ubq-headline_label')).toContainText('Element');

    // Remove randomly selected Shape
    //await page.getByLabel('Undo').click();

    // //Click on X button to close the Formats panel
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('section').filter({ hasText: 'Shapes' })).not.toBeVisible();

});