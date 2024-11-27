import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

//Use the saved authentication state

test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

//Prompt Options Applying
test('Prompt Options Applying', async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);

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

    const promptButton = page.getByRole('button', { name: 'help Prompt', exact: true })

    await expect(promptButton).toBeVisible({ timeout: 10000 });
    await promptButton.click();

    // Assertions of Prompt Popup
    await expect(page.getByText('what would you like to')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'back', exact: true }).click();
    await expect(page.getByText('what would you like to')).not.toBeVisible();
    await promptButton.click();

    // Fill prompt without
    await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').click();
    await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').fill('Some Test Message');  // can be automated
    await page.getByRole('button', { name: 'use prompt to design' }).click();

    // Popup Assertions
    await expect(page.getByText('this will exit and create a')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'stay here' }).click();
    await expect(page.getByText('this will exit and create a')).not.toBeVisible();
    await promptButton.click();

    // Fill prompt with random format and subject
    const formatIdeas = [
        'Poster', 'Logo', 'Infographic', 'Website', 'Mobile App Interface',
        'Business Card', 'Advertisement Banner', 'Packaging', 'Social Media Post', 'Magazine Cover'
    ];

    const subjectIdeas = [
        'Music Festival', 'Technology Startup', 'Wildlife Conservation', 'Space Exploration', 'Coffee Shop',
        'Fitness App', 'Sustainable Fashion', 'Online Education Platform', 'Art Exhibition', 'Charity Event'
    ];

    // Generate random indices
    const randomFormatIndex = Math.floor(Math.random() * formatIdeas.length);
    const randomSubjectIndex = Math.floor(Math.random() * subjectIdeas.length);

    // Get the random format and subject
    const randomFormat = formatIdeas[randomFormatIndex];
    const randomSubject = subjectIdeas[randomSubjectIndex];

    // Fill the placeholder with the selected format and subject
    await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').click();
    await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').fill(`Design a ${randomFormat} for a ${randomSubject}`);
    await page.getByRole('button', { name: 'use prompt to design' }).click();
    await page.getByRole('button', { name: 'ignore my current project' }).click();
    console.log(`Filled with: Design a ${randomFormat} for a ${randomSubject}`);

    // Soft Accertions >> Check some genetrating flow & if the URL contains '/tool/scene/'

    const softAssertions = [];

    try {
        await expect(page.getByText('understanding the prompt')).toBeVisible({ timeout: 20000 });
    } catch (error) {

        softAssertions.push(`Assertion failed: understanding the prompt - ${error.message}`);
    }

    try {
        await expect(page.getByText('generating visuals')).toBeVisible({ timeout: 20000 });
    } catch (error) {

        softAssertions.push(`Assertion failed: generating visuals - ${error.message}`);
    }

    try {
        await expect(page.getByText('writing text')).toBeVisible({ timeout: 20000 });
    } catch (error) {
        softAssertions.push(`Assertion failed: writing text - ${error.message}`);
    }

    // Wait for the page to load completely
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    // Check if the URL contains '/tool/scene/' 
    try {
        await page.waitForURL('**/tool/scene/**', { timeout: 30000 });
        const currentUrl = page.url();
        expect(currentUrl).toContain('/tool/scene/');
    } catch (error) {
        softAssertions.push(`Assertion failed: URL contains '/tool/scene/' - ${error.message}`);
    }
    // Log all soft assertion errors
    if (softAssertions.length > 0) {

        console.log('Soft assertion errors:', softAssertions.length);
        softAssertions.forEach(assertion => console.log(assertion));
    }
});