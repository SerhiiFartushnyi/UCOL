Playwright Project Setup and Usage Guide

Prerequisites

Ensure the following tools are installed before proceeding:
	•	Node.js

Installation

	1.	Clone the Repository
Clone the project into your preferred folder:

git clone <repository-url>
cd <repository-folder>


	2.	Navigate to the Playwright Folder

cd Playwright


	3.	Install Playwright
Run the following command to set up Playwright:

npm init playwright@latest

	⚠️ Note: This step may overwrite the playwright.config.js file. When prompted, skip overwriting the config file.

	4.	Install Dependencies
Install the required dependencies using the following commands:

npm i @faker-js/faker
npm i dotenv --save-dev --force


	5.	Set Up Environment Variables
	•	Create a .env file in the Playwright folder.
	•	Refer to the .env.example file and configure your credentials accordingly.
	6.	Install VS Code and Plugins
	•	Download and install VS Code.
	•	Install the Playwright plugin for VS Code for enhanced development support.

Configuration

	1.	Verify Configuration Files
	•	Ensure you are using the appropriate configuration files. Use the files provided in pull requests or specific branches if necessary.
	•	Review all files, and update paths as required.
	2.	Adjust Test Files
	•	Update the paths or data in the following test files as needed:
	•	C7424: Modify file paths for testing specific files on your local machine.
	•	C5654: Update the path for the file you want to upload.
	•	C7394: Replace the random email with an existing email address for the signup process.
	3.	Verify Base URL
Ensure the base URL is correctly set in playwright.config.js:

baseURL: process.env.BASE_URL


	4.	Mock Google Authentication
	•	Run the following script to initialize Google Authentication:

node tests/saveAuthState.js


	•	Complete the manual authentication process in the browser.
	•	Ensure the auth.json file is created in the Playwright folder.

Running Tests

	1.	Run Tests
Use the following commands to execute the tests:
	•	Run all tests in headless mode:

npx playwright test


	•	Run tests in headed mode:

npx playwright test --headed


	•	Check Playwright Documentation for additional options.

	2.	View Test Results
To view the test report:

npx playwright show-report

Additional Notes

	•	Ensure that any custom paths in the code or test files are updated to match your local system setup.
	•	Regularly sync with the repository to stay updated with the latest changes.

Example File Edits

Here are some example changes you may need to make:
	•	File Paths
Update file paths in C7424 and C5654 to reflect the location of files on your machine.
	•	Random Email
Replace random emails in C7394 with a valid email address to use during the signup process.

Helpful Links

	•	Playwright Documentation
	•	Node.js Installation Guide

License

This project is licensed under the MIT License.

Contributing

We welcome contributions! Feel free to submit a pull request or open an issue to suggest improvements.

This README adheres to common GitHub practices, ensuring clarity and ease of use for developers collaborating on your project.