import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/* 
//BEGOERE RUNING THE TESTS
 RUN node saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL2;
const password = process.env.PASSWORD2;

test.beforeEach(async ({ page }) => {
    
    // Login
    await login(page, email, password);
});

// 'Start designing now' button functionality (Logged in User)
test('Start designing now button functionality (logged in User)', async ({ page }) => {
    test.slow();
    await page.goto('/');
        
        // Check if the 'Start designing now' button is present
    
        await expect(page.locator('#create-template')).toContainText('start designing');
        await page.locator('#create-template').click();

        // Check if User is on Scene Editor Page
        //await page.waitForLoadState('networkidle');
        if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
            await page.waitForLoadState('networkidle');
        }
        await expect(page.getByRole('heading', { name: 'New Design' })).toBeVisible({ timeout: 10000 });
        const currentUrl = page.url();
        expect(currentUrl).toContain('/tool/scene/');
       
});
