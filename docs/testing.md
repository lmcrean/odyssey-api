# Testing

The testing process for the Odyssey app involves both manual and automated testing to ensure the functionality and integrity of the application. 

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
| Edit profile picture | Signed in | User is able to edit their profile picture | Edited the profile picture | User was able to edit their profile picture | FAIL$$$$$$$$$$ |
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

# Automated Testing in Frontend with Jest, Cypress and Playwright

# Automated Frontend Testing Results
The app includes automatic tests for core components and functionality using testing frameworks like Jest.

- To run tests, use the following command:
  ```bash
  npm test
  ```
- Tests cover components like message forms, message lists, and detail views to ensure the integrity of the app's messaging functionality.



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

Here's a summary of the test files and what they cover:

## Jest Summaries
| Test File | Description | Key Methodologies |
|-----------|-------------|-------------------|
| Message.test.js | - Tests fetching and displaying the sender's username<br>- Checks error handling when fetching username fails<br>- Verifies the opening and closing of the delete modal<br>- Ensures proper rendering of message content and metadata | - Mocking API responses (axios)<br>- Rendering components with React Testing Library<br>- Simulating user interactions (fireEvent)<br>- Asynchronous testing (act, waitFor)<br>- Snapshot testing for UI consistency |
| MessageDetailSendForm.test.js | - Tests the submission of a message with an image<br>- Verifies form data handling and API call formation | - Mocking API calls (axiosReq)<br>- Form submission testing<br>- File input handling<br>- Asynchronous testing (waitFor)<br>- Checking API call parameters |
| MessageDetailSendFormAPI.test.js | - Mocks and tests the API call for sending a message with an image<br>- Verifies the structure and content of the API response | - Mocking Axios for API calls<br>- Testing API endpoint and payload<br>- Verifying response structure<br>- Handling FormData in tests |
| MessageWithImage.test.js | - Tests the rendering of a message component with an attached image<br>- Verifies the correct display of message content and image | - Rendering components with React Testing Library<br>- Mocking Context API (useCurrentUser)<br>- Asynchronous component testing (act)<br>- Testing image rendering and attributes |
| SignUpForm.test.js | - Tests the rendering of the sign-up form<br>- Checks form validation and error display<br>- Verifies form submission and redirection on success | - Rendering components with React Testing Library<br>- Mocking API calls (axios)<br>- Simulating form input and submission<br>- Testing error handling and display<br>- Checking navigation/redirection (useHistory mock) |

The most common methodologies used in testing were mocking API calls with `axios` and `jest.mock`, rendering components with `React Testing Library`, simulating user interactions with `fireEvent`, and handling asynchronous testing with `act` and `waitFor`. Asynchronous testing means that the test waits for a certain condition to be met before proceeding, ensuring that the app behaves as expected in real-world scenarios.
