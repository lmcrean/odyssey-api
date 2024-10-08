# Automated and Manual Testing outcomes

This Readme chapter introduces the **outcomes** of the Automated and Manual Testing. For instructions of how to carry out the tests refer to the **Usage & Deployment** readme chapter - for readibility it is not covered here.

The testing process generally favoured **TDD (Test Driven Development)** methodologies, where tests were written before the implementation of features. This approach helps ensure that the codebase remains stable and that new features do not break existing functionality. For that reason the Automatic Testing is introduced first. Manual Testing was then conducted after the completion of the app to ensure that all features work as expected from a user's perspective.

# Automated Testing in Frontend with Jest, Cypress and Playwright

The app includes automatic tests for core components and functionality using testing frameworks like Jest.



## Playwright Testing

Playwright was used as the most important tool for end-to-end testing. It allows for testing the app's functionality from a user's perspective, simulating real interactions with the UI.

The tests are divided into 2 sets of tests: `frontend/playwright/screenshot-tests` and `frontend/playwright/validation-tests`. 

- `frontend/playwright/screenshot-tests` captures the UI at different states in mobile , tablet, laptop and desktop views.
- `frontend/playwright/validation-tests` validates the functionality of the app by simulating user interactions and checking for error and success messages that will guide and/or inform the user.

### Playwright Screenshot Tests

The screenshot tests are used to ensure that the app's UI looks as expected across different screen sizes. The tests capture screenshots of the app in different states and compare them to reference images to detect any visual regressions.

They can be summarised as follows:

| User Journey location | Mobile | Tablet | Laptop | Desktop |
| --- | --- | --- | --- | --- |
| Landing Page | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/landing-page/mobile-home-page-after-login.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/landing-page/tablet-home-page-after-login.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/landing-page/laptop-home-page-after-login.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/landing-page/desktop-home-page-after-login.png"> |
| Landing Page (scrolled) | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/landing-page/mobile-scrolled-to-4th-post.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/landing-page/tablet-scrolled-to-4th-post.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/landing-page/laptop-scrolled-to-4th-post.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/landing-page/desktop-scrolled-to-4th-post.png"> |
| Messages Page | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/messages/mobile-messages-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/messages/tablet-messages-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/messages/laptop-messages-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/messages/desktop-messages-page.png"> |
| Message Detail | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/messages/mobile-message-detail.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/messages/tablet-message-detail.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/messages/laptop-message-detail.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/messages/desktop-message-detail.png"> |
| Create Post Page | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/posts/mobile-create-post-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/posts/tablet-create-post-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/posts/laptop-create-post-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/posts/desktop-create-post-page.png"> |
| Profile Page | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/profiles/mobile-profile-141-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/profiles/tablet-profile-141-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/profiles/laptop-profile-141-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/get-requests/profiles/desktop-profile-141-page.png"> |

### Playwright Validation Tests

The validation tests are used to ensure that the app's functionality works as expected. They simulate user interactions and check for error and success messages that guide and inform the user.


### Success Message alerts

Due to time constraints, success messages only confirm Sign in and Sign up. Additional creenshots also confirm the Messages disappear after a set time (omitted below).

| Success Alerts | Test 1 | Test 2 | 
| --- | --- | --- | 
| Screenshots | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/success-alerts/mobile-01-signup-success.png"> |  <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/success-alerts/mobile-03-signin-success.png"> | 
| Alert Description | Signup success | Signin success | 

***
Below are all validation alerts, meaning the user has done something that is not allowed by the app. The app will inform the user of the error and guide them to correct it.

### Create comment alerts

|  Create Comments | Test 1 | Test 2 | Test 3 |
| --- | --- | --- | --- |
| Screenshots | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-comment/full-empty-submission.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-comment/full-long-comment.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-comment/full-spaces-only.png"> |
| Alert Description | Empty submission | Long comment | Spaces only |

### Create Post alerts

All posts require a valid image, title and caption.

| Create Post | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Test 6 | Test 7 | Test 8 | Test 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Screenshots | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/full-content-only-spaces.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/full-content-too-long.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/mobile-empty-submission.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/mobile-image-no-title.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/mobile-image-uploaded.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/mobile-no-image.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/mobile-non-image-file-error.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/mobile-title-only-spaces.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/create-post/mobile-title-too-long.png"> |
| Alert Description | Content only spaces | Content too long | Empty submission | Image no title | (Image uploaded successfully, no alert) | User is posting without an image | Non-image file error | Title only spaces | Title too long |

### Send Message and /or Image alerts

| Message Send | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Test 6 | Test 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Screenshots | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/message-send/mobile-1-empty-submission.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/message-send/mobile-2-message-too-long.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/message-send/mobile-3-spaces-only.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/message-send/mobile-4-image-too-large.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/message-send/mobile-5-invalid-image-type.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/message-send/mobile-6-valid-image-no-message.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/message-send/mobile-7-valid-message-no-image.png"> |
| Alert Description | Empty submission | Message too long | Spaces only | Image too large | Invalid image type | Valid image, no message | Valid message, no image |

### Password Update alerts

| Password Update | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Test 6 | Test 7 | Test 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Screenshots | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/password-update/mobile-01-logged-in-profile-view.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/password-update/mobile-02-change-password-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/password-update/mobile-03-passwords-dont-match.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/password-update/mobile-04-password-too-short.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/password-update/mobile-05-password-too-common.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/password-update/mobile-06-password-entirely-numeric.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/password-update/mobile-07-password-similar-to-username.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/password-update/mobile-08-unauthorized-access.png"> |
| Alert Description | Logged in profile view | Change password page | Passwords don't match | Password too short | Password too common | Password entirely numeric | Password similar to username | Unauthorized access |

### Profile Edit alerts

| Profile Edit | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Test 6 | Test 7 | Test 8 | Test 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Screenshots | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-01-initial-profile-edit-page.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-02-bio-too-long.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-03-bio-empty.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-04-bio-only-spaces.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-05-bio-more-than-three-spaces.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-06-valid-image-upload.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-07-large-image-upload.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-08-invalid-file-upload.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/profile-edit/mobile-09-unauthorized-access.png"> |
| Alert Description | (Initial profile edit page) | Bio too long | Bio empty | Bio only spaces | Bio more than three spaces | (valid image upload confirms as working, no alert) | Large image upload | Invalid file upload | Unauthorized access |

### Sign In alerts

| Sign In | Test 1 | Test 2 | Test 3 |
| --- | --- | --- | --- | 
| Screenshots | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signin/mobile-empty-form-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signin/mobile-invalid-password-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signin/mobile-invalid-username-alert.png"> | 
| Alert Description | Empty form alert | Invalid password alert | Invalid username alert | 

### Sign Up alerts

| Sign Up | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Test 6 | Test 7 | Test 8 | Test 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Screenshots | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-common-password-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-empty-form-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-existing-username-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-numeric-password-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-password-too-short-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-passwords-dont-match-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-username-too-long-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-username-too-short-alert.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/signup/mobile-username-with-spaces-alert.png"> |
| Alert Description | Common password alert | Empty form alert | Existing username alert | Numeric password alert | Password too short alert | Passwords don't match alert | Username too long alert | Username too short alert | Username with spaces alert |



### Username Update alerts

| Username Update | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | 
| --- | --- | --- | --- | --- | --- | 
| Screenshots |  <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/username-update/mobile-03-username-too-short.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/username-update/mobile-04-username-too-long.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/username-update/mobile-05-username-with-spaces.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/username-update/mobile-06-existing-external-username.png"> | <img src="https://raw.githubusercontent.com/lmcrean/odyssey-api/main/frontend/playwright/screenshots/alerts/username-update/mobile-07-existing-own-username.png"> |
| Alert Description |  Username too short | Username too long | Username with spaces | Existing external username | Existing own username |

## Jest Testing

Jest testing was explored in the frontend to test the core components and functionality of the app. The tests are located in the `frontend/src/pages` directory, with each page having its own test folder `__tests__`.

Here's a summary of the test files and what they cover:


```bash
 PASS  src/pages/messaging/__tests__/MessageDetailSendFormAPI.test.js
 PASS  src/pages/auth/__tests__/SignUpForm.test.js (5.295 s)
 PASS  src/pages/messaging/__tests__/MessageWithImage.test.js (5.58 s)
 PASS  src/pages/messaging/__tests__/Message.test.js (5.51 s)
 PASS  src/pages/messaging/__tests__/MessageDetailSendForm.test.js (5.992 s)
 PASS  src/App.test.js (6.04 s)

Test Suites: 6 passed, 6 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        7.916 s
Ran all test suites.
```


| Test File | Alert Description | Key Methodologies |
|-----------|-------------|-------------------|
| Message.test.js | - Tests fetching and displaying the sender's username<br>- Checks error handling when fetching username fails<br>- Verifies the opening and closing of the delete modal<br>- Ensures proper rendering of message content and metadata | - Mocking API responses (axios)<br>- Rendering components with React Testing Library<br>- Simulating user interactions (fireEvent)<br>- Asynchronous testing (act, waitFor)<br>- Snapshot testing for UI consistency |
| MessageDetailSendForm.test.js | - Tests the submission of a message with an image<br>- Verifies form data handling and API call formation | - Mocking API calls (axiosReq)<br>- Form submission testing<br>- File input handling<br>- Asynchronous testing (waitFor)<br>- Checking API call parameters |
| MessageDetailSendFormAPI.test.js | - Mocks and tests the API call for sending a message with an image<br>- Verifies the structure and content of the API response | - Mocking Axios for API calls<br>- Testing API endpoint and payload<br>- Verifying response structure<br>- Handling FormData in tests |
| MessageWithImage.test.js | - Tests the rendering of a message component with an attached image<br>- Verifies the correct display of message content and image | - Rendering components with React Testing Library<br>- Mocking Context API (useCurrentUser)<br>- Asynchronous component testing (act)<br>- Testing image rendering and attributes |
| SignUpForm.test.js | - Tests the rendering of the sign-up form<br>- Checks form validation and error display<br>- Verifies form submission and redirection on success | - Rendering components with React Testing Library<br>- Mocking API calls (axios)<br>- Simulating form input and submission<br>- Testing error handling and display<br>- Checking navigation/redirection (useHistory mock) |

The most common methodologies used in testing were mocking API calls with `axios` and `jest.mock`, rendering components with `React Testing Library`, simulating user interactions with `fireEvent`, and handling asynchronous testing with `act` and `waitFor`. Asynchronous testing means that the test waits for a certain condition to be met before proceeding, ensuring that the app behaves as expected in real-world scenarios.

# Manual Testing 

Pass criteria includes no warning messages, no errors.

## Testing the Navbar

| Feature | Auth status: <br> Signed in/Signed out/ Both |Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| Sign up | Signed out | User is redirected to the sign up page | Clicked on the sign up button | User was redirected to the sign up page | Pass |
| Sign in | Signed out | User is redirected to the sign in page | Clicked on the sign in button | User was redirected to the sign in page | Pass |
| Home Feed | Signed in | User is redirected to the home feed | Clicked on the home feed button | User was redirected to the home feed | Pass |
| Add Post | Signed in | User is redirected to the add post page | Clicked on the add post button | User was redirected to the add post page | Pass |
| Messages | Signed in | User is redirected to the messages page | Clicked on the messages button | User was redirected to the messages page | Pass |
| Profile | Signed in | User is redirected to the profile page | Clicked on the profile button | User was redirected to the profile page | Pass |
| Sign Out | Signed in | User is signed out and redirected to the sign in page | Clicked on the sign out button | User was signed out and redirected to the sign in page | Pass |
| Responsive Design | Both | Navbar is responsive, will switch between a sidebar and bottom in different views, there must be no breaks particularly around the 768px where the hook activates. | Tested on different screen sizes | Navbar was responsive | Pass |

## Testing the Home Feed

| Feature | Auth status: <br> Signed in/Signed out/ Both |Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| Posts | Both | User is able to view posts | Viewed the posts | User was able to view the posts | Pass |
| Like Post | Signed in | User is able to like a post, updates Like Count | Liked a post, updates like count | User was able to like a post | Pass |
| Unlike Post | Signed in | User is able to unlike a post, updates Like Count | Unliked a post, updates like count | User was able to unlike a post | Pass |
| For you tab | Signed in | Displays recent posts | Clicked on the for you tab | Recent posts were displayed | Pass |
| Following tab | Signed in | Displays posts from users the user is following | Clicked on the following tab | Posts from users the user is following were displayed | Pass |
| Liked tab | Signed in | Displays posts the user has liked | Clicked on the liked tab | Posts the user has liked were displayed | Pass |


## Testing the Post functionality

| Feature | Auth status: <br> Signed in/Signed out/ Both |Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| Add Post | Signed in | User is able to add a post | Added a post | User was able to add a post, was visible on home feed | Pass |
| Edit Post | Signed in | User is able to edit a post | Edited a post | User was able to edit a post | Pass |
| Delete Post | Signed in | User is able to delete a post | Deleted a post | User was able to delete a post | Pass |

## Testing the Profile Page

| Feature | Auth status: <br> Signed in/Signed out/ Both |Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| View Profile | Both | User is able to view their profile | Viewed the profile | User was able to view their profile | Pass |
| Edit username | Signed in | User is able to edit their profile username | Edited the profile username | User was able to edit their username | Pass |
| Edit bio | Signed in | User is able to edit their profile bio | Edited the profile bio | User was able to edit their bio | Pass |
| Edit profile picture | Signed in | User is able to edit their profile picture | Edited the profile picture | User was able to edit their profile picture | Pass |
| follow user link | Signed in | User is able to follow another user | Followed another user | User was able to follow another user | Pass |
| message user link | Signed in | User is able to message another user | Messaged another user | User was able to message another user | Pass |

## Testing the Messages Page

| Feature | Auth status: <br> Signed in/Signed out/ Both |Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| View Messages | Signed in | User is able to view their messages | Viewed the messages | User was able to view their messages | Pass |
| Send Message with Picture | Signed in | User is able to send a message with picture | sent message with attached file | User was able to send picture, it appears in chat interface | Pass | 
| Send Message | Signed in | User is able to send a message | Sent a message | User was able to send a message | Pass |
| Delete Message | Signed in | User is able to delete a message | Deleted a message | User was able to delete a message | Pass |

## Testing the Sign Up Page

| Feature | Auth status: <br> Signed in/Signed out/ Both |Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| Sign Up | Signed out | User is able to sign up | Signed up | User was able to sign up | Pass |
| Sign Up Validation | Signed out | User is unable to sign up with invalid credentials | Signed up with invalid credentials | User was unable to sign up | Pass |

## Testing the Sign In Page

| Feature | Auth status: <br> Signed in/Signed out/ Both |Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| Sign In | Signed out | User is able to sign in | Signed in | User was able to sign in | Pass |
| Sign In Validation | Signed out | User is unable to sign in with invalid credentials | Signed in with invalid credentials | User was unable to sign in | Pass |

## Popular profiles component

| Feature | Auth status: <br> Signed in/Signed out/ Both | Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| Popular profiles | Both | User is able to view popular profiles | Viewed popular profiles | User was able to view popular profiles | Pass |
| Follow user | Signed in | User is able to follow a popular profile | Followed a popular profile | User was able to follow a popular profile | Pass |
| Message user | Signed in | User is able to message a popular profile | Messaged a popular profile | User was able to message a popular profile | Pass |

## Landing Page

| Feature | Auth status: <br> Signed in/Signed out/ Both | Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- |
| Landing Page | Both | User is able to view the landing page | Viewed the landing page | User was able to view the landing page | Pass |
| Sign Up | Signed out | User is able to sign up from the landing page | Signed up from the landing page | User was able to sign up from the landing page | Pass |
| Sign In | Signed out | User is able to sign in from the landing page | Signed in from the landing page | User was able to sign in from the landing page | Pass |

