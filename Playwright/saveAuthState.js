const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Go to your app's login page
  await page.goto('https://ucl-coolab-dev.uk.r.appspot.com/');

  await page.waitForTimeout(60000); // To have time to login manually

  // Perform manual login (e.g., fill Google credentials or click through the Google OAuth flow)
  // You may need to automate this part if you want to bypass manual intervention

  // Once logged in, save storage state (cookies and local storage)
  await page.context().storageState({ path: 'auth.json' });

  // Close browser
  await browser.close();

});