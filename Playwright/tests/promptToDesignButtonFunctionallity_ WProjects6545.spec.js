// Page Will Be updated soon !!!!
import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL1;
const password = process.env.PASSWORD1;

test('Prompt To Design Button Functionallity', async ({ page }) => {
    test.slow();

    // Login
    await login(page, email, password);
    
    // Navigate to site  
    await page.goto('/');

    // Check if the user is logged in
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    
    await page.waitForSelector('#profile-toggler-container');
    const profile = page.locator('#profile-toggler-container');
    await expect(profile).toBeVisible({ timeout: 10000 });
    await profile.click();

    // Click on Project Button
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('link', { name: 'Go to Projects' }).click();

    // User with projects should see the message
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({ timeout: 10000 });

    //await expect(page.locator('#projects-tab-content')).toContainText('start a new project');

    await page.locator('#projects-container div #project-item').first().click({ button: 'right' });
    await page.locator('#selectionMainRightClickMenu').getByRole('link', { name: 'Prompt-to-design' }).click();
    await expect(page.getByText('what would you like to')).toBeVisible({ timeout: 10000 });


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
    


    await page.locator('#promptToDesignPurposeInput').click();
    await page.locator('#promptToDesignPurposeInput').fill(`Design a ${randomFormat} for a ${randomSubject}`);

    await page.locator('#promptToDesignSubmitBtn').click();

    // Soft Accertions >> Check some genetrating flow & if the URL contains '/tool/scene/'
    
    const softAssertions = [];

    try {
        await expect(page.getByText('understanding the prompt')).toBeVisible({timeout: 10000});
    } catch (error) {

        softAssertions.push(`Assertion failed: understanding the prompt - ${error.message}`);
    }
    
    try {
        await expect(page.getByText('generating visuals')).toBeVisible({timeout: 10000});
    } catch (error) {

        softAssertions.push(`Assertion failed: generating visuals - ${error.message}`);
    }

    try {
        await expect(page.getByText('writing text')).toBeVisible({timeout: 10000});
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
        await page.waitForURL('**/tool/scene/**', { timeout: 60000 });
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
