1. Install Node JS: https://nodejs.org/en/download/package-manager
2. Pull project 
3. Go to Playwright folder
4. Install PlayWright in Playwright folder:
   npm init playwright@latest
   (this step can rewright playwright.config.js so check it before runing test) 
6. Install Faker:
    npm i @faker-js/faker
7. Install VSCode
8. Install PlayWright plugin for VSCode
9. Check config file , update if needed (should be used file form pull request)

10. Run tests in Playwright folder: npx playwright test
11. Check tests results: npx playwright show-report 