# Usage instructions & Deployment


# Installation with Gitpod IDE/ VSCode

It would be advisable to use the [Gitpod IDE](http://gitpod.io) for the installation process, as it is pre-configured with the necessary tools and dependencies, especially around `nvm` and linking to the API.

To get the frontend app up and running locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone http://github.com/lmcrean/odyssey_react.git
   ```

2.  Navigate to the `/frontend` directory
   ```bash
   cd frontend
   ```

3. **Install dependencies**:
   install the required dependencies:

   ```bash
   npm install
   ```

4. **Install correct node version**:
   Run the following command to check Node Version Manager (nvm) has installed the correct version of Node.js:

   ```bash
   nvm install 16
   ```

5. **Run build**:
   Run the following command to build the React app locally:
   ```bash
   npm run build
   ```

6. **Split the terminal, open the development server**:
   Split the terminal so we can run the API and frontend at the same time

   In terminal 1, run the API.
   ```bash
   python3 manage.py runserver
   ```


   In Terminal 2, go to `/frontend` and open the following command to start the React app locally:
   ```bash
   cd frontend
   npm start
   ```
   This should open in port `8080` or something similar - it will contain the latest changes.


## Committing to Production - Note on compiling static files


This command will delete the old `build` and replace it with the new one with `npm run build && rm -rf ../staticfiles/build && mv build ../staticfiles/. `

```bash
npm run deploy
```

You will need to re-run this command any time you want to deploy changes to the static files in your project, including the React code.

# Deployment to Heroku

The project is deployed to Heroku, and the following steps are required to deploy the project to Heroku:

1. **Create a Heroku account**:
   If you don't already have a Heroku account, you can create one [here](https://signup.heroku.com/).

2. **Install the Heroku CLI**: 
   You can install the Heroku CLI by following the instructions [here](https://devcenter.heroku.com/articles/heroku-cli).

3. **Login to Heroku**: 
   Run the following command to login to Heroku:
   ```bash
   heroku login -i
   ```
   This will open a browser window where you can log in to your Heroku account. Gitpod users must use `-i` to login via the terminal. 

4. **Create a new Heroku app**:

   Run the following command to create a new Heroku app:
   ```bash
   heroku create
   ```

5. **Set up the Heroku remote**:
   Run the following command to set up the Heroku remote:
   ```bash
   heroku git:remote -a <your-app-name>
   ```
   Replace `<your-app-name>` with the name of your Heroku app.

6. **Deploy the app**:
   Run the following command to deploy the app to Heroku:
   ```bash
   git push heroku main
   ```

7. **Configure the variables**:
   Set the environment variables in the Heroku dashboard. You can do this by navigating to the `Settings` tab in your Heroku app and clicking on the `Reveal Config Vars` button.

   - `ALLOWED_HOST`: Set this to the domain name of your Heroku app.
   - `CLIENT ORIGIN`: Set this to the domain name of your frontend app.
   - `CLIENT_ORIGIN_DEV`: Set this to the domain name of your frontend app in development.
   - `CLOUDINARY_URL`: Set this to the Cloudinary URL.
   - `DATABASE_URL`: Set this to the URL of your Heroku Postgres database.
   - `SECRET_KEY`: Set this to a random string of characters.

   ![alt text](assets/media/herokuconfig.png)

8. **env.py file**:
   Ensure the `env.py` file is set up correctly for the Heroku deployment.

   This project uses environment variables to manage configuration settings securely. Here's an overview of the key variables:

```python
import os

os.environ['SECRET_KEY'] = '********'  # Django secret key
os.environ['CLOUDINARY_URL'] = 'cloudinary://************************'  # Cloudinary configuration URL
os.environ['DATABASE_URL'] = 'postgres://**************************'  # Database URL for PostgreSQL
os.environ['CLIENT_ORIGIN'] = 'https://*****************.herokuapp.com'  # Frontend application URL
os.environ['ALLOWED_HOST'] = '*****************.herokuapp.com'  # Allowed host for the API
os.environ['DEBUG'] = '0'  # Set to '1' for debug mode, '0' for production
# os.environ['DEV'] = '1'  # Uncomment to enable development mode

```

These environment variables are crucial for the application's security and configuration:

- `SECRET_KEY`: Used by Django for cryptographic signing.
- `CLOUDINARY_URL`: Configuration for Cloudinary media storage.
- `DATABASE_URL`: Connection string for the PostgreSQL database.
- `CLIENT_ORIGIN`: URL of the frontend application for CORS settings.
- `ALLOWED_HOST`: The domain name of the API for Django's security checks.
- `DEBUG`: Enables Django's debug mode when set to '1'.
- `DEV`: When uncommented and set to '1', enables development-specific settings.

In a production environment, these variables should be set securely and not hard-coded in the source code. For local development, you might use a `.env` file or environment-specific configuration.

# Automated Testing Instructions

The project uses Jest, Playwright and Cypress for testing. The backend uses Django's built-in testing framework.

## Jest Testing

Tests are located in the `/__tests__` folder, interspersed throughout the js files in `/frontend` directory. To run the tests, use the following command:

First, ensure the frontend is opened with:

```bash
cd frontend
```

then run the tests with:
```bash
npm run test
```

## Playwright Testing


Tests are located in the `playwright` folder. To run the tests, use the following commands to **split 3 terminals**:

1. API
2. Frontend
3. Playwright


See the following diagram.

!["assets/media/playwright.png"](assets/media/playwright.png)


## Running Tests in terminal 3

To run all tests:

```bash
npx playwright test
```

To run a specific test, for example `frontend/playwright/auth.test.js`, you can use:

```bash
npx playwright test playwright/auth.spec.js
```

## shorthand commands

- Check `package.json` for more tests that have been shorthanded.

## Cypress Testing

Tests are located in the `cypress/integration` folder. To run the tests, use the following command:

1. Open 3 split terminals and run terminal one and two **exactly the same way as Playwright instructions**,

2. In terminal 3, run the following commands to set up cypress (shortened version of the commands for readability, see package.json):

```bash
cd frontend
npm run cypress 1
npm run cypress 2
npm run cypress 3
```

these commands will install prerequisites before finally installing cypress.

3. In the same terminal, run the following command to run the tests:

```bash
npx cypress open
```

or to run a specific test, for example `frontend/cypress/e2e/auth.cy.js` you can write something like this:

```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
npx cypress run --spec "cypress/e2e/user_journey.cy.js" --headed
```


# Automated Testing in Backend with python

Tests are located in the `tests` subfolders, each nested in the relevant app folder. To run the tests, use the following command:

```bash
python3 manage.py test
```

Before Starting the tests the following needs to be uncommented in `env.py file`:

```python
os.environ['DEV'] = '1' # Uncomment the following line to enable development mode
```
