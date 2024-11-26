1. Install NodeJS: https://nodejs.org/en/download/package-manager
2. Clone project to prefered Folder
3. Go to Playwright folder
4. Install PlayWright in Playwright folder:
   npm init playwright@latest
   (this step can rewright playwright.config.js so check it before runing test)
6. Install Faker:
    npm i @faker-js/faker
7. Install dotenv
    npm i dotenv --save-dev --force
8. In Playwright Folder create .env file ( check .env.example file .exampleand set you credentials according to .env.example)
9. Install VSCode
10. Install PlayWright plugin for VSCode

11. Check in  file , update if needed (should be used file form pull request)
12. To Mock Google Auth run in Terminal
    node tests/saveAuthState.js ,
    Perform Manual Google Authentigication
    make sure Auth.json file in Playwright folder is created
13. In C7424 file  change Paths to files on your PC you want to use while testing
14. In C5654 file change path to file you want to upload
15. in C7394 file change random email to your existing email to be able to use it in Sign Up process
16. Run tests in Playwright folder: npx playwright test 
    npx playwright test --headed (check Playwright Documentation for more options https://playwright.dev/docs/running-tests#command-line)
17. Check tests results: npx playwright show-report
