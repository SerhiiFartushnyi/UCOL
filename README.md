
	1.	Install Node.js
Follow the instructions to install Node.js: Node.js Installation Guide.
	2.	Clone the Project
Clone the repository into your preferred folder.
	3.	Navigate to the Playwright Folder
Change your working directory to the Playwright folder.
	4.	Install Playwright
Run the following command in the Playwright folder to install Playwright:

npm init playwright@latest

⚠️ Note: This step may overwrite the playwright.config.js file. Skip overwriting the file when prompted.

	5.	Install Dependencies
	•	Install Faker.js:

npm i @faker-js/faker


	•	Install dotenv:

npm i dotenv --save-dev --force


	6.	Create an .env File
	•	In the Playwright folder, create a .env file.
	•	Use the .env.example file as a reference and set your credentials accordingly.
	7.	Set Up VS Code
	•	Install VS Code.
	•	Install the Playwright plugin for VS Code.
	8.	Verify Configuration Files
	•	Review all relevant configuration files. Ensure you’re using the correct files from pull requests or shared repositories.
	9.	Mock Google Authentication
	•	Run the following command to mock Google authentication:

node tests/saveAuthState.js


	•	Perform manual Google authentication.
	•	Ensure the auth.json file is created in the Playwright folder.

	10.	Adjust Test Files
	•	In the C7424 test file, update paths to files on your local machine as needed.
	•	In the C5654 test file, update the file path for the file you intend to upload.
	•	In the C7394 test file, replace the random email with an existing email address for the signup process.
	11.	Verify Base URL
	•	In the playwright.config.js file, ensure the baseURL is set as follows:

baseURL: process.env.BASE_URL


	12.	Run Tests
	•	To run all tests:

npx playwright test


	•	To run tests with a headed browser:

npx playwright test --headed


	•	Refer to the Playwright Documentation for additional options.

	13.	View Test Results
	•	To view the test report:

npx playwright show-report

General Suggestions:

	•	Add headings for sections like Installation, Configuration, Running Tests, etc., to improve structure.
	•	Ensure file names like C7424, C5654, etc., have more descriptive labels or a context explanation.
	•	Proofread for minor typos (e.g., “rewrite” instead of “rewright,” “preferred” instead of “prefered,” “you” instead of “you.”).
    
13. In C7424 file  change Paths to files on your PC you want to use while testing
14. In C5654 file change path to file you want to upload
15. in C7394 file change random email to your existing email to be able to use it in Sign Up process
16. Check that in playwright.config.js baseUrl set  like this -  baseURL: process.env.BASE_URL
17. Run tests in Playwright folder: npx playwright test 
    npx playwright test --headed (check Playwright Documentation for more options https://playwright.dev/docs/running-tests#command-line)
18. Check tests results: npx playwright show-report
