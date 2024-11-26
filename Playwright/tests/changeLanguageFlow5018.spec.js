import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();
/*
BEGOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Change Language
test ('Change Language', async ({ page }) => {
    test.slow()
    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    
    //Assertions to check if the user is on Main Page
    await expect(page.locator('body')).toContainText('Design professional');

    // Attempt to click on the #language-toggler element directly

    //await page.waitForLoadState('networkidle'); //!!!WAIT FOR ALL RENDERED !!! WAIT FOR ALL NETWORK REQUESTS TO FINISHED 
    const languageToggler = page.locator('#language-toggler');
    await expect(languageToggler).toBeVisible({timeout: 10000});
    await languageToggler.click();

    //await page.waitForLoadState('networkidle')

    await page.locator('#language-dropdown').getByText('Español').click();

    //Accertion of the language change to Espaniol
    expect(page.url()).toContain('/?language=es');
    await expect(page.getByRole('navigation')).toContainText('aprender');

    //await page.waitForLoadState('networkidle');
    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible({timeout: 10000});
    await profileIcon.click();
    await expect(page.locator('#profile-container')).toContainText('Desconectar');
    
    // Click on the element with the text 'Desconectar'
    await page.getByRole('link', { name: 'Desconectar' }).click();

});

test('Change Language Not logged in User', async ({ page }) => {
    await page.goto('/');

    //Assertions  user is on main page
    await expect(page.locator('body')).toContainText('Design professional');

    // Attempt to click on the #language-toggler element directly
    //await page.waitForLoadState('networkidle'); //!!!WAIT FOR ALL RENDERED !!! WAIT FOR ALL NETWORK REQUESTS TO FINISHED 
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#language-toggler');
    const languageToggler = page.locator('#language-toggler');
    await expect(languageToggler).toBeVisible({timeout: 10000});
    await languageToggler.click();

    //await page.waitForLoadState('networkidle')
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    await page.locator('#language-dropdown').getByText('Português Brasileiro').click();

    //Accertion of the language change to Espaniol
    await expect(page.getByRole('navigation')).toContainText('aprender');
    await expect(page.locator('#profile')).toContainText('Conecte-se');
    expect(page.url()).toContain('/?language=pt-br');
});
