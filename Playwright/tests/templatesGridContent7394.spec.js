//Updated:13Nov24
import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;

test('Template Grid Content', async ({ page }) => {
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

    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible();
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible();
    expect(page.url()).toContain('/templates/');

    // Choose a random style
    const styles = page.locator('#genres-list > li.rounded-lg');
    // Get the text of all the styles
    const stylesTextArray = await styles.evaluateAll(elements => 
    elements.map(element => element.querySelector('a').textContent.trim())
);
    // Click on a random style
    const randomIndex = Math.floor(Math.random() * stylesTextArray.length);
    const randomStyle = stylesTextArray[randomIndex];
    await page.getByRole('link', { name: randomStyle }).click();

    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    const allTemplates = page.getByText('all templates loaded');
    await expect(allTemplates).toBeVisible();

    const otherGenres = page.getByText(' / OTHER GENRES YOU MAY LIKE')
    await otherGenres.scrollIntoViewIfNeeded();
    await expect(otherGenres).toBeVisible();

    // Check if the recommended and alternative templates are visible

    const locator1 = page.locator('#recommended-arles');
    const locator2 = page.locator('#recommended-bahaus');

    const isLocator1Visible = await locator1.isVisible();
    const isLocator2Visible = await locator2.isVisible();

  if (isLocator1Visible) {
    await locator1.scrollIntoViewIfNeeded();
    await locator1.click();
    console.log('Locator 1 is visible and scrolled into view');
  } else if (isLocator2Visible) {
    await locator2.scrollIntoViewIfNeeded();
    await locator2.click();
    console.log('Locator 2 is visible and scrolled into view');
  } else {
    throw new Error('Neither locator is visible');
  }

    //Check More and Less button
    const moreButton = page.getByRole('button', { name: 'More' });
    await expect(moreButton).toBeVisible();
    await moreButton.click();
    
    const lessButton = page.getByRole('button', { name: 'Less' });
    await expect(lessButton).toBeVisible();
    await lessButton.click();

    // Click on random template
    const templates = page.locator('.infinite-item > .relative > .w-full');
    const templatesCount = await templates.count();
    const randomTemplateIndex = Math.floor(Math.random() * templatesCount);
    await templates.nth(randomTemplateIndex).click();

    // Check if the Name is visible
    await page.locator('#modalName').isVisible();
    // Check if the Image is visible
    await page.locator('#modalImage').isVisible();
    // Check if the "use this template" button is visible
    await expect(page.getByRole('link', { name: 'use this template' })).toBeVisible();
    // Check if the "add to favorites" button is visible
    await expect(page.locator('#addToFavoritesBtn')).toBeVisible();
    // Check if 'You might also like' section is visible
    await expect(page.getByText('You might also like')).toBeVisible();

    // Click on a random recommended template
    const recommended = page.locator('#modalRecommended');
    const recommendedCount = await recommended.count();
    const randomRecomendedIndex = Math.floor(Math.random() * recommendedCount);
    await recommended.nth(randomRecomendedIndex).click();

});