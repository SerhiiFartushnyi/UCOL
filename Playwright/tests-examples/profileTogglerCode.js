// Check if the user is logged in
const profileIcon = page.locator('#profile-toggler');
await page.waitForSelector('#profile-toggler');
await expect(profileIcon).toBeVisible();
await profileIcon.click();
