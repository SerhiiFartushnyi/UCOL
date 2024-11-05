const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  try {
    console.log('Launching browser...');
    // Launch browser
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('Navigating to login page...');
    // Go to your app's login page
    await page.goto('https://ucl-coolab-dev.uk.r.appspot.com/');

    console.log('Waiting for manual login...');
    await page.waitForTimeout(60000); // To have time to login manually

    // Perform manual login (e.g., fill Google credentials or click through the Google OAuth flow)
    // You may need to automate this part if you want to bypass manual intervention

    console.log('Saving storage state...');
    // Once logged in, save storage state (cookies and local storage)
    await page.context().storageState({ path: 'auth.json' });

    console.log('Closing browser...');
    // Close browser
    await browser.close();

    console.log('Authentication state saved successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
})();