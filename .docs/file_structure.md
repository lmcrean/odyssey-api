# Frontend Directory Structure

The frontend directory structure is designed to organize the React application's codebase effectively. Here's an overview of the key directories and their purposes:

## `frontend/cypress/`
- Contains end-to-end tests using Cypress
- Includes test specifications like `cypress/e2e/auth.cy.js` for authentication testing
- Configuration in `cypress.config.js` sets up the testing environment

## `frontend/node_modules/`
- Contains all the npm packages and dependencies installed via `npm install`
- Managed by `npm`, not typically modified directly
- Essential for running the application and its development environment

## `frontend/playwright/`
- Houses browser automation and testing scripts using Playwright
- Includes tests like `playwright/auth.spec.js` for cross-browser authentication testing
- Configured via `playwright.config.js` for multi-browser support

## `frontend/public/`
- Contains static assets that are publicly accessible
- Includes `index.html`, `favicon.ico`, and other static resources
- Files here are served directly without being processed by webpack

## `frontend/screenshots/`
- Stores screenshots taken during automated tests
- Useful for visual regression testing and debugging
- Screenshots are typically named based on the test, e.g., `auth-test-failed-1.png`

## `frontend/src/`
The main source code directory for the React application. Contains various subdirectories:

### `frontend/src/api/`
- Handles API configurations and defaults
- `axiosDefaults.js` sets up base URL and default headers for API requests

### `frontend/src/assets/`
- Stores static assets like `logo.png` and `upload.png`
- Includes images and icons used throughout the application

### `frontend/src/components/`
- Contains reusable React components
- Includes components like `Asset.js`, `Avatar.js`, and `NavBar.js`
- `MoreDropdown.js` provides a reusable dropdown menu component

### `frontend/src/contexts/`
Holds React context providers for state management:

- `CurrentUserContext.js`: Manages user authentication state
- `ProfileDataContext.js`: Handles profile data and follow/unfollow functionality
- `PostCacheContext.js`: Implements post caching for performance
- `AnimationLoadingContext.js`: Manages animation loading states
- `ThemeContext.js`: Controls app-wide theme settings (light/dark mode)

### `frontend/src/fonts/`
- Stores custom font files like `Fontspring-DEMO-coresansc65.otf`
- Ensures consistent typography across the app

### `frontend/src/hooks/`
- Contains custom React hooks like `useClickOutsideToggle.js` and `useRedirect.js`
- `useWindowSize.js` provides responsive design utilities

### `frontend/src/mocks/`
- Includes mock data and handlers in `handlers.js` for testing
- Simulates API responses for consistent testing environments

### `frontend/src/pages/`
Contains page components organized by feature:

#### `frontend/src/pages/auth/`
- `SignInForm.js` and `SignUpForm.js` manage user authentication

#### `frontend/src/pages/comments/`
- `Comment.js`, `CommentCreateForm.js`, and `CommentEditForm.js` handle comment functionality

#### `frontend/src/pages/messaging/`
- `Message.js`, `MessageList.js`, `MessageDetail.js` manage the messaging feature
- `MessageDetailSendForm.js` handles sending new messages

#### `frontend/src/pages/posts/`
- `Post.js`, `PostCreateForm.js`, `PostEditForm.js` manage post CRUD operations
- `PostsPage.js` displays the main feed of posts

#### `frontend/src/pages/profiles/`
- `Profile.js`, `ProfileEditForm.js` handle user profile management
- `PopularProfiles.js` showcases popular user profiles

### `frontend/src/styles/`
- `variables.css` defines global CSS variables for consistent styling
- `base.css` provides base styles for the app such as fonts, colors and fallbacks

#### `frontend/src/styles/modules/`
- Houses component-specific CSS module files
- Examples include:
  - `Post.module.css` for styling post components
  - `Profile.module.css` for profile-related styles
  - `MessageList.module.css` for message list styling
  - `NavBarDesktop.module.css` and `NavBarMobile.module.css` for responsive navigation styling
- Each module corresponds to a specific component, enabling scoped styling
- there is an `animations` folder containing CSS files for custom animations
- `LikeAnimation.module.css` defines styles for the post liking animation

### `frontend/src/utils/`
- `utils.js` contains utility functions like `fetchMoreData` for infinite scrolling

## `frontend/test-results/`
- Stores test results, often in JSON format like `test-results.json`
- Useful for analyzing test outcomes and generating reports

This structure organizes the frontend code into logical sections, promoting maintainability and scalability. Each directory and file serves a specific purpose in creating a robust React application.

# Backend Directory Structure

## `drf_api/`
Main project directory for the Django Rest Framework API.

### `settings.py`
Main configuration file for the Django project. Includes database settings, installed apps, middleware, and other core settings.

### `urls.py`
Defines the main URL routing for the entire project, including admin, API endpoints, and authentication URLs.

### `views.py`
Contains custom views for the project, such as the root route view.

### `permissions.py`
Defines custom permissions, like `IsOwnerOrReadOnly`, to control access to various API endpoints.

### `serializers.py`
Contains custom serializers, like `CurrentUserSerializer`, for data transformation between complex types and Python datatypes.

## `comments/`
Handles the comment functionality for posts, allowing users to interact with content.

### `models.py`
Defines the `Comment` model, representing the structure of a comment in the database.

### `views.py`
Contains views for listing, creating, retrieving, updating, and deleting comments. Includes `CommentList` and `CommentDetail` views.

### `serializers.py`
Defines serializers for comments, including `CommentSerializer` and `CommentDetailSerializer`, to convert comment data between JSON and Python objects.

## `followers/`
Manages follower relationships between users, enabling social networking features.

### `models.py`
Defines the `Follower` model, representing the follow relationship between users.

### `views.py`
Contains views for listing, creating, retrieving, and deleting follower relationships. Includes `FollowerList` and `FollowerDetail` views.

### `serializers.py`
Defines the `FollowerSerializer` for handling follower data serialization and deserialization.

## `likes/`
Handles the like functionality for posts, allowing users to express appreciation for content.

### `models.py`
Defines the `Like` model, representing a user's like on a post.

### `views.py`
Contains views for listing, creating, retrieving, and deleting likes. Includes `LikeList` and `LikeDetail` views.

### `serializers.py`
Defines the `LikeSerializer` for processing like data.

## `messaging/`
Manages the messaging functionality between users, enabling private communication.

### `models.py`
Defines the `Message` model, representing individual messages between users.

### `views/`
Contains separate view files for different message-related operations:
- `message_list_view.py`: Handles listing of messages.
- `message_detail_view.py`: Manages retrieving individual message details.
- `message_detail_send_view.py`: Handles sending new messages.
- `message_start_new_view.py`: Manages starting new conversations.
- `message_delete_view.py`: Handles deletion of messages.
- `chat_delete_view.py`: Manages deletion of entire conversations.
- `message_update_view.py`: Handles updating of messages.

### `serializers.py`
Defines the `MessageSerializer` for handling message data serialization and deserialization.

### `tests/`
Contains various test files to ensure the reliability of the messaging functionality.

## `posts/`
Manages the post functionality, which is central to the application, allowing users to share content.

### `models.py`
Defines the `Post` model, representing the structure of a post in the database.

### `views/`
Contains separate view files:
- `post_list_view.py`: Handles listing and creation of posts.
- `post_detail_view.py`: Manages retrieval, updating, and deletion of individual posts.

### `serializers.py`
Defines the `PostSerializer` for handling post data serialization and deserialization.

### `tests/`
Contains test files to ensure the reliability of post-related functionality.

## `profiles/`
Handles user profile management, allowing users to customize their personal information.

### `models.py`
Defines the `Profile` model, representing user profiles in the database.

### `views/`
Contains separate view files:
- `profile_list_view.py`: Handles listing of user profiles.
- `profile_detail_view.py`: Manages retrieval and updating of individual profiles.
- `profile_list_most_followed_view.py`: Handles listing profiles sorted by follower count.

### `serializers.py`
Defines the `ProfileSerializer` for handling profile data serialization and deserialization.

### `tests/`
Contains test files to ensure the reliability of profile-related functionality.

## `users/`
Manages user-related operations, extending Django's built-in user model functionality.

### `views.py`
Contains views for user operations, including `UserListView` for listing users and `UserDetailView` for retrieving individual user details.

### `serializers.py`
Defines the `UserSerializer` for handling user data serialization and deserialization.

## Root Directory Files
- `manage.py`: Django's command-line utility for administrative tasks.
- `requirements.txt`: Lists all Python dependencies required for the project.
- `Procfile`: Specifies commands for deployment platforms like Heroku.

This structure organizes the backend code into logical sections based on functionality, promoting maintainability and scalability. Each app is responsible for a specific feature of the application, with its own models, views, and serializers, working together to create a comprehensive social media platform API.