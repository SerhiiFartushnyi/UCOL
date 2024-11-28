#   Playwright Project Setup and Usage Guide

##  Prerequisites

1. Install Node.js:

   - Follow the Node.js Installation Guide

2. Install VSCode (or other )

  - Visit https://code.visualstudio.com/download 

## Installation Steps

### 1.  Clone the Project

Clone the repository to your preferred folder:

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2.   Navigate to the Playwright Folder

```bash
cd Playwright
```

### 3.  Install Playwright

Run the following command to set up Playwright:

```bash
npm init playwright@latest
```
⚠️ Note: This step may overwrite the playwright.config.js file. Skip overwriting the file when prompted.


### 4.  Install Faker.js

```bash
npm i @faker-js/faker
```

### 5.	Install dotenv

```bash
npm i dotenv --save-dev --force
```

### 6. Set Up Environment Variables

•	Create a .env file in the Playwright folder.

•	Refer to the .env.example file and set your credentials accordingly.

### 7. Setting Up VS Code

1.	Install Visual Studio Code. ( Optional )
2.	Install the Playwright plugin for VS Code: ( Optional )


### 8. Configuration

1.	Review Configuration Files
Ensure the correct configuration files are being used. Use files from pull requests if applicable.

2.	Mock Google Authentication

	•	Run the following script to set up Google Authentication:

```bash
node saveAuthState.js
```
•	Perform manual Google authentication in the browser.

•	Ensure the auth.json file is created in the Playwright folder.


3.	Adjust Test Files

	•	In the C7424 file, update file paths for testing specific files on your local machine.
	
	•	In the C5654 file, update the path to the file you want to upload.
	
	•	In the C1837 file, replace the random email with your existing email address for the signup process.
	

4.	Set Base URL

Ensure the baseURL is correctly set in playwright.config.js as follows:

baseURL: process.env.BASE_URL

### 9. Running Tests

1.	Run tests in the Playwright folder using the following commands:

•	Run all tests in headless mode:
```bash
npx playwright test
```

•	Run tests in headed mode:
```bash
npx playwright test --headed
```
•	Check the Playwright Documentation for additional options.


2.	View the test report:
```bash
npx playwright show-report
```

Additional Notes

•	Update paths in the test files 
	
Case C7424 file - change Paths to files on your PC you want to use while testing

Case C5654 file -  change path to file you want to upload

Case C7394 file  change random email to your existing email to be able to use it in Sign Up process 

•	Ensure all dependencies are installed and up to date.