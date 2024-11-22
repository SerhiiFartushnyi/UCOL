1. Install NodeJS: https://nodejs.org/en/download/package-manager
2. Clone project to prefered Folder
3. Go to Playwright folder
4. Install PlayWright in Playwright folder:
   npm init playwright@latest
   (this step can rewright playwright.config.js so check it before runing test)
6. Install Faker:
    npm i @faker-js/faker
7. Install VSCode
8. Install PlayWright plugin for VSCode
9. Check config file , update if needed (should be used file form pull request)
10. To Mock Google Auth run in Terminal
    node tests/saveAuthState.js ,
    Perform Manual Google Authentigication
    make sure Auth.json file in Playwright folder is created
11. In C7424 file  change Paths to files on your PC you want to use while testing
12. In C5654 file change path to file you want to upload
11. Run tests in Playwright folder: npx playwright test
12. Check tests results: npx playwright show-report
