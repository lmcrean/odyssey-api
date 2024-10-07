# API Readme

This Readme focuses on the API for the social media platform. The API is built using Django Rest Framework.

Anything already mentioned in the documentation of Frontend Repository, such as Agile Methodology, is omitted here for brevity.

# Models Structure Diagram

The API Model Diagram demonstrates the social media platform has the following models: User, Post, Comment, Follower, Like, Profile, and Message. Users can own posts, write comments, like posts, follow other users, have profiles, and send messages.


```mermaid
erDiagram
    User {
        string username
        string email
        string password
    }
    Post {
        string title
        text content
        image image
        string image_filter
        datetime created_at
        datetime updated_at
    }
    Comment {
        text content
        datetime created_at
        datetime updated_at
    }
    Follower {
        datetime created_at
    }
    Like {
        datetime created_at
    }
    Profile {
        string name
        text content
        image image
        datetime created_at
        datetime updated_at
    }
    Message {
        text content
        image image
        datetime timestamp
        boolean read
        boolean is_user
    }

    User ||--o{ Post : owns
    User ||--o{ Comment : writes
    User ||--o{ Like : likes
    User ||--o{ Follower : follows
    User ||--o{ Profile : has
    User ||--o{ Message : sends
    Post ||--o{ Comment : receives
    Post ||--o{ Like : receives
    Follower ||--o{ User : followed
    Message ||--o{ User : receives
```

# API endpoints, Manual Testing with Postman 

Below summarises the API endpoints for the social media platform.

| HTTP Method | URL   | Notes    | View type (List, Detail, NA) | POST/PUT input    | Output  | 
| ---- | --------------------- | ---------------- | ------------------ | --------------------------------------------------- | ------------------ |
| POST        | dj-rest-auth/login/            |                                               | List                         | {<br>"username": "postmanuser",<br>"password": "password"<br>}                                                           | {<br>"access_token": "eyJ0eXAiOiJKV1QiL...", /\*omitted]<br>"refresh_token": "eyJ0eXAiOiJKV1QiL...", /\*omitted<br>"user": {<br>"pk": 25,<br>"username": "postmanuser",<br>"email": "",<br>"first_name": "",<br>"last_name": "",<br>"profile_id": 24,<br>"profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg"<br>}<br>}          |
| GET         | /users/                        | Retrieve user list                            | List                         |      | {<br>"count": 10,<br>"next": null,<br>"previous": null,<br>"results": [<br>{<br>"id": 28,<br>"username": "testuser7"<br>},<br>{<br>"id": 21,<br>"username": "testuser23"<br>},<br>{<br>"id": 24,<br>"username": "posttmanusr"<br>},<br>...<br>]<br>}                    |
| GET         | /users/{id}/                   | Retrieve user details                         | Detail                       |      | {<br>"id": 29,<br>"username": "user"<br>}                                                                                                                |
|             | MESSAGES APP                   |
| GET         | /messages/                     | Retrieve message list                         | List                         |      | [<br>{<br>"id": 29,<br>"username": "user",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"last_message": "hi there",<br>"last_message_time": "11:52"<br>},<br>{<br>"id": 24,<br>"username": "posttmanusr",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"last_message": "Hi there! This is POST requesting with Postman on ...",<br>"last_message_time": "21 Aug"<br>},<br>{<br>"id": 22,<br>"username": "user3",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"last_message": "yo!",<br>"last_message_time": "21 Aug"<br>}<br>]                                                                            |
| GET         | /messages/{id}/                | Retrieve message details                      | Detail                       |      | {<br>"count": 7,<br>"next": null,<br>"previous": null,<br>"results": [<br>{<br>"id": 117,<br>"sender": 25,<br>"recipient": 29,<br>"content": "Hi Test with upload image in API prod",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1724751086/brdqibwyd1phcukqn6gq.jpg",<br>"date": "27 Aug 2024",<br>"time": "09:31",<br>"read": false,<br>"sender_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"is_sender": true,<br>"last_message": "hi there",<br>"last_message_time": "11:52"<br>},<br>...<br>]<br>}                   |
| POST        | /messages/{id}/send/           | Send a new message                            | Detail                       | {<br>"content": "Hi there! This is POST requesting with Postman on production"<br>}                                      | {<br>"id": 133,<br>"sender": 25,<br>"recipient": 29,<br>"content": "Hi there! This is POST requesting with Postman on production",<br>"image": null,<br>"date": "28 Aug 2024",<br>"time": "11:39",<br>"read": false,<br>"sender_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"is_sender": true,<br>"last_message": "Hi there! This is POST requesting with Postman on ...",<br>"last_message_time": "11:39"<br>}           |
| POST        | /messages/{id}/send/           | Send a message with an image                  | Detail                       | "{<br>"content": "Hi there"<br>"image": "image.png"<br>}"                                                                | {<br>"id": 134,<br>"sender": 25,<br>"recipient": 29,<br>"content": "hi there",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1724845255/haxht48ba5gcerdlgucn.png",<br>"date": "28 Aug 2024",<br>"time": "11:40",<br>"read": false,<br>"sender_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"is_sender": true,<br>"last_message": "hi there",<br>"last_message_time": "11:40"<br>}                        |
| POST        | /messages/{recipient_id}/send/ | Start a new conversation                      | Detail                       | {<br>"content": "hello user5!"<br>}                                                                                      | {<br>"id": 133,<br>"sender": 25,<br>"recipient": 29,<br>"content": "hello user5!",<br>"image": null,<br>"date": "28 Aug 2024",<br>"time": "11:39",<br>"read": false,<br>"sender_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"is_sender": true,<br>"last_message": "hello user5!",<br>"last_message_time": "11:39"<br>}                                                                                                    |
| DELETE      | /messages/{id}/delete/         | Delete a specific message                     |                              | "{<br>"content": "Hi there"<br>"image": "image.png"<br>}"                                                                | {<br>"id": 134,<br>"sender": 25,<br>"recipient": 29,<br>"content": "hi there",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1724845255/haxht48ba5gcerdlgucn.png",<br>"date": "28 Aug 2024",<br>"time": "11:40",<br>"read": false,<br>"sender_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"is_sender": true,<br>"last_message": "hi there",<br>"last_message_time": "11:40"<br>}                        |
| PATCH       | /messages/{id}/update/         | Update a specific message                     | Detail                       | "{<br>""content"": ""hello user5!""<br>}"                                                                                | {<br>"id": 117,<br>"sender": 25,<br>"recipient": 29,<br>"content": "hello user5!",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1724751086/brdqibwyd1phcukqn6gq.jpg",<br>"date": "27 Aug 2024",<br>"time": "09:31",<br>"read": false,<br>"sender_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"recipient_profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"is_sender": true,<br>"last_message": "hi there",<br>"last_message_time": "11:40"<br>}                    |
| DELETE      | /messages/{id}/delete/         | Delete an entire chat                         |                              |      |                                      |
|             | POSTS APP                      |
| POST        | /posts/                        | Create a new post (with or without image)     | Detail                       | {<br>"title": "My Test Post (Postman API)"<br>"content": "This is a test post content"<br>"image": "test_image.png"<br>} | {<br>"id": 48,<br>"owner": "postmanuser",<br>"is_owner": true,<br>"profile_id": 24,<br>"profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"created_at": "27 Aug 2024",<br>"updated_at": "27 Aug 2024",<br>"title": "My Test Post (Postman API)",<br>"content": "This is a test post content",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image_whk6ly",<br>"image_filter": "normal",<br>"like_id": null<br>}                                                                                                         |
| GET         | /posts/                        | Get Posts List                                | List                         |      | {<br>"count": 8,<br>"next": null,<br>"previous": null,<br>"results": [<br>{<br>"id": 48,<br>"owner": "postmanuser",<br>"is_owner": true,<br>"profile_id": 24,<br>"profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"created_at": "27 Aug 2024",<br>"updated_at": "27 Aug 2024",<br>"title": "My Test Post (Postman API)",<br>"content": "This is a test post content",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image_whk6ly",<br>"image_filter": "normal",<br>"like_id": null,<br>"likes_count": 0,<br>"comments_count": 0<br>},<br>{<br>"id": 47,<br>"owner": "postmanuser",<br>"is_owner": true,<br>"profile_id": 24,<br>"profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"created_at": "27 Aug 2024",<br>"updated_at": "27 Aug 2024",<br>"title": "My Test Post (Postman API)",<br>"content": "This is a test post content",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image_aukhfj",<br>"image_filter": "normal",<br>"like_id": null,<br>"likes_count": 0,<br>"comments_count": 0<br>},<br>... |
| GET         | /posts/{id}/                   | Retrieve a specific post                      | Detail                       |      | {<br>"id": 47,<br>"owner": "postmanuser",<br>"is_owner": true,<br>"profile_id": 24,<br>"profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"created_at": "27 Aug 2024",<br>"updated_at": "27 Aug 2024",<br>"title": "My Test Post (Postman API)",<br>"content": "This is a test post content",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image_aukhfj",<br>"image_filter": "normal",<br>"like_id": null,<br>"likes_count": 0,<br>"comments_count": 0<br>}                                                            |
| PUT         | /posts/{id}/                   | Update a post (title, content, image, or all) | Detail                       | {<br>"title": "My Test Post (Postman API)"<br>"content": "This is a test post content"<br>"image": "test_image.png"<br>} | {<br>"id": 48,<br>"owner": "postmanuser",<br>"is_owner": true,<br>"profile_id": 24,<br>"profile_image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",<br>"created_at": "27 Aug 2024",<br>"updated_at": "28 Aug 2024",<br>"title": "My Test Post (Postman API)",<br>"content": "This is a test post content",<br>"image": "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image_z1iqf3",<br>"image_filter": "normal",<br>"like_id": null,<br>"likes_count": 0,<br>"comments_count": 0<br>}                                                            |
| DELETE      | /posts/{id}/                   | Delete a specific post                        |                              |      |

# Apps

This section provides an overview of the core components of our social media application, excluding the messaging functionality. The apps all use the Django-Rest-Framework.

## Messaging App

This Django-based messaging app provides a robust backend for a real-time chat application. It includes features such as sending messages, managing conversations, and handling user profiles.

### Models

The core model of the application is `Message`, which includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `sender` | ForeignKey | User who sent the message |
| `recipient` | ForeignKey | User who received the message |
| `content` | TextField | Content of the message |
| `image` | CloudinaryField | Optional image attachment |
| `timestamp` | DateTimeField | Time when the message was sent |
| `read` | BooleanField | Indicates if the message has been read |

### Views

1. **MessageListView**: Displays a list of users the current user has had conversations with, along with the last message and timestamp.

2. **MessageDetailView**: Shows the thread of messages between two users.

3. **MessageDetailSendView**: Allows sending a new message in an existing conversation.

4. **MessageListStartNewView**: Initiates a new conversation with a user.

5. **MessageDeleteView**: Deletes a specific message.

6. **ChatDeleteView**: Deletes an entire conversation between two users.

7. **MessageUpdateView**: Allows editing of a sent message.

### Serializers

The `MessageSerializer` handles the serialization of Message objects, including:
- Formatting date and time
- Retrieving sender and recipient profile images
- Determining if the current user is the sender
- Fetching and truncating the last message
- Validating image uploads

### URLs

The app uses the following URL patterns:

| Endpoint | Description |
|----------|-------------|
| `/messages/` | List all conversations |
| `/messages/<int:user_id>/` | View/send messages in a specific conversation |
| `/messages/<int:user_id>/send/` | Send a new message |
| `/messages/<int:user_id>/start/` | Start a new conversation |
| `/messages/<int:pk>/delete/` | Delete a specific message |
| `/messages/<int:pk>/update/` | Update a specific message |
| `/chats/<int:user_id>/delete/` | Delete an entire conversation |

### Tests

The app includes comprehensive test coverage:

1. **MessageWithImageTestCase**: Tests sending messages with images.
2. **MessageWithImageValidationTestCase**: Validates image uploads, including size and format restrictions.
3. **MessageListViewTest**: Tests the conversation list view.
4. **IsSenderFieldTests**: Ensures the `is_sender` field is correctly set.
5. **MessageSerializerTests**: Validates the message serializer functionality.
6. **ChatDeleteTest**: Tests the chat deletion feature.
7. **MessageSendTests**: Verifies message sending functionality.
8. **MessageDeleteTest**: Checks message deletion.
9. **MessageListStartNewViewTests**: Tests initiating new conversations.
10. **MessageUpdateTests**: Verifies message editing functionality.
11. **MessageModelTests**: Ensures correct timestamp behavior for messages.

### Key Features

- Real-time messaging
- Image support in messages
- User profile integration
- Conversation management (start, delete)
- Message operations (send, edit, delete)
- Comprehensive test coverage
- Cloudinary integration for image storage

## Posts app

This app manages user posts, including creation, retrieval, updating, and deletion. It also handles post likes and comments.

Key features

- Create, view, update, and delete posts
- Filter posts by user, followed users, and liked posts

### Model
The `Post` model is defined in `posts/models.py`:

| Field | Type | Properties |
|-------|------|------------|
| owner | ForeignKey | User model |
| created_at | DateTimeField | auto_now_add=True |
| updated_at | DateTimeField | auto_now=True |
| title | CharField | max_length=255 |
| content | TextField | blank=True |
| image | ImageField | upload_to='images/', default='../default_post_rgq6aq', blank=True |

Ordering: ['-created_at']

### Views
Located in `posts/views.py`:

| View | Type | Description |
|------|------|-------------|
| PostList | ListCreateAPIView | List and create posts, custom ordering, filtering |
| PostDetail | RetrieveUpdateDestroyAPIView | Retrieve, update, delete individual posts |

Both views use `IsOwnerOrReadOnly` permission class.

### Serializer
`PostSerializer` in `posts/serializers.py`:

| Field | Type | Description |
|-------|------|-------------|
| id, owner, title, content, image | Model fields | Direct from Post model |
| is_owner | SerializerMethodField | Check if current user is post owner |
| profile_id, profile_image | ReadOnlyField | From user's profile |
| created_at, updated_at | ReadOnlyField | Timestamp fields |
| like_id | SerializerMethodField | ID of current user's like, if any |
| likes_count | SerializerMethodField | Total number of likes |
| comments_count | SerializerMethodField | Total number of comments |

Custom methods:
- `validate_image`: Validates image file size and dimensions
- `get_is_owner`, `get_like_id`, `get_likes_count`, `get_comments_count`: Compute respective fields

### Filters
Custom `PostFilter` in `posts/views.py`:

| Filter | Description |
|--------|-------------|
| owner | Posts by a specific user |
| followed | Posts from followed users |
| liked | Posts liked by the current user |

### URLs
Defined in `posts/urls.py`:

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `posts/` | GET, POST | List and create posts |
| `posts/<int:pk>/` | GET, PUT, PATCH, DELETE | Retrieve, update, delete a specific post |

### Tests
Located in `posts/tests.py`:

| Test Class | Description | Key Tests |
|------------|-------------|-----------|
| PostListViewTests | Tests for post creation | - Create post when logged in<br>- Cannot create post when logged out<br>- Post title is required<br>- Image size limits |
| PostDetailViewTests | Tests for post operations | - Retrieve post by id<br>- Update own post<br>- Cannot update others' posts<br>- Delete own post<br>- Cannot delete others' posts |
| PostListViewFilterTests | Tests for post filtering | - Filter by followed users<br>- Filter when not following anyone<br>- Filter liked posts<br>- Filter by specific user |
| PostListViewOrderTests | Tests for post ordering | - Order by likes<br>- Order by comments<br>- Default order (created date) |

## Comments

key features:
- Create, view, update, and delete comments

| Aspect | Details |
|--------|---------|
| Model | `Comment` in `comments/models.py`<br>Fields: owner (User), post (Post), created_at, updated_at, content |
| Views | `CommentList` (ListCreateAPIView)<br>`CommentDetail` (RetrieveUpdateDestroyAPIView) |
| Serializer | `CommentSerializer` and `CommentDetailSerializer` in `comments/serializers.py`<br>Custom fields: is_owner, formatted timestamps |
| Tests | Located in `comments/tests.py`<br>Should cover: creation, retrieval, update, deletion |

## Likes app

Key features:
- Like posts
- View likes count for each post
- Unlike posts

| Aspect | Details |
|--------|---------|
| Model | `Like` in `likes/models.py`<br>Fields: owner (User), post (Post), created_at<br>Unique constraint: owner and post |
| Views | `LikeList` (ListCreateAPIView)<br>`LikeDetail` (RetrieveDestroyAPIView) |
| Serializer | `LikeSerializer` in `likes/serializers.py`<br>Handles unique constraint in create method |
| Tests | Located in `likes/tests.py`<br>Should cover: creation, retrieval, deletion, duplicate attempts |

## Follows app

Key features
- Follow users
- View followers and following count
- Unfollow users

| Aspect | Details |
|--------|---------|
| Model | `Follower` in `followers/models.py`<br>Fields: owner (User), followed (User), created_at<br>Unique constraint: owner and followed |
| Views | `FollowerList` (ListCreateAPIView)<br>`FollowerDetail` (RetrieveDestroyAPIView) |
| Serializer | `FollowerSerializer` in `followers/serializers.py`<br>Handles unique constraint in create method |
| Tests | Located in `followers/tests.py`<br>Should cover: creation, retrieval, deletion, duplicate attempts |

## Users app

This is the core app for user management, including registration, authentication, and profile management, it is mostly handled by Django's built-in User model.

| Aspect | Details |
|--------|---------|
| Model | Django's built-in User model |
| Views | `UserListView` (ListAPIView)<br>`UserDetailView` (RetrieveAPIView) |
| Serializer | `UserSerializer` (assumed) |
| Tests | Not explicitly provided, but should be implemented |

## Profiles app

This is an extension of the User model, providing additional fields and functionality for user profiles.

Key features:
- Create, view, update, and delete profiles
- Retrieve profiles by user ID
- Upload profile images

| Aspect | Details |
|--------|---------|
| Model | `Profile` in `profiles/models.py`<br>Fields: owner (OneToOneField to User), created_at, updated_at, name, content, image |
| Views | `ProfileList` (ListAPIView)<br>`ProfileDetail` (RetrieveUpdateAPIView) |
| Serializer | `ProfileSerializer` in `profiles/serializers.py` |
| Tests | Located in `profiles/tests.py` |

### Model
The `Profile` model is defined in `profiles/models.py`:

| Field | Type | Properties |
|-------|------|------------|
| owner | OneToOneField | User model, on_delete=models.CASCADE |
| created_at | DateTimeField | auto_now_add=True |
| updated_at | DateTimeField | auto_now=True |
| name | CharField | max_length=255, blank=True |
| content | TextField | blank=True |
| image | ImageField | upload_to='images/', default='../default_profile_qdjgyp' |

### Views
Located in `profiles/views.py`:

| View | Type | Description |
|------|------|-------------|
| ProfileList | ListAPIView | List all profiles |
| ProfileDetail | RetrieveUpdateAPIView | Retrieve and update individual profiles |

`ProfileDetail` uses `IsOwnerOrReadOnly` permission class.

### Serializer
`ProfileSerializer` in `profiles/serializers.py`:

| Field | Type | Description |
|-------|------|-------------|
| owner | ReadOnlyField | Username of the profile owner |
| is_owner | SerializerMethodField | Check if current user is profile owner |
| following_id | SerializerMethodField | ID of follower object if user is following this profile |
| posts_count | ReadOnlyField | Number of posts by the profile owner |
| followers_count | ReadOnlyField | Number of followers for the profile |
| following_count | ReadOnlyField | Number of users the profile owner is following |

### Unit Tests
Located in `profiles/tests.py`:

| Test Class | Description | Key Tests |
|------------|-------------|-----------|
| ProfileListViewTests | Tests for profile list view | - Retrieve all profiles |
| ProfileDetailViewTests | Tests for profile detail view | - Retrieve profile by id<br>- Update own profile<br>- Cannot update other users' profiles |

These tests cover profile retrieval and update operations, ensuring that proper permissions are enforced.

### URLs
Defined in `profiles/urls.py`:

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `profiles/` | GET | List all profiles |
| `profiles/<int:pk>/` | GET, PUT | Retrieve or update a specific profile |

# Cloudinary Integration for image storage

This project integrates Cloudinary for efficient media management and delivery. Cloudinary is used to store and serve images for posts, profiles, and messages.

### Configuration

The Cloudinary configuration is set up in `drf_api/settings.py`:

```python
CLOUDINARY_STORAGE = {
    'CLOUDINARY_URL': os.environ.get('CLOUDINARY_URL')
}
MEDIA_URL = '/media/'
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

The `CLOUDINARY_URL` is fetched from environment variables for security. This URL contains the necessary credentials for your Cloudinary account.

Cloudinary is used in various models across the project:

1. In `posts/models.py`, the `Post` model uses an `ImageField`:

   ```python
   image = models.ImageField(
       upload_to='images/', default=get_default_post_image, blank=True
   )
   ```

2. In `profiles/models.py`, the `Profile` model also uses an `ImageField`:

   ```python
   image = models.ImageField(
       upload_to='images/', 
       default=get_default_profile_image
   )
   ```

3. In `messaging/models.py`, the `Message` model uses a `CloudinaryField`:

   ```python
   image = CloudinaryField('image', blank=True, null=True)
   ```

### Image Processing

The `MessageSerializer` in `messaging/serializers.py` includes logic for validating and processing images before upload:

```python
def validate_image(self, image):
    if image.size > 5 * 1024 * 1024:  # 5MB limit
        raise serializers.ValidationError("Image file too large (max 5MB)")
    
    try:
        img = Image.open(image)
        img.verify()
    except (IOError, Image.DecompressionBombError):
        raise serializers.ValidationError("Invalid image file")
    
    return image
```

### Benefits of Cloudinary Integration

1. **Efficient Storage**: Images are stored in the cloud, reducing server storage requirements.
2. **Fast Delivery**: Cloudinary's CDN ensures quick image loading times for users worldwide.

# Database Population and Mock Data

## `populate_db` Management Command

The project includes a custom Django management command `populate_db` to seed the database with initial data. This command is defined in `drf_api/management/commands/populate_db.py`.

Key features:

1. **Data Source**: Reads from `mock_data.json`.
2. **User Creation**: Creates User and Profile objects.
3. **Content Generation**: Creates Posts, Comments, and Likes.
4. **Error Handling**: Manages potential integrity errors.

The command performs the following steps:

1. Creates User accounts and associated Profiles.
2. Generates Posts for each user, with comments and likes.

Usage:
```bash
python manage.py populate_db
```

## `mock_data.json`

The `mock_data.json` file contains structured data used by the `populate_db` command. It includes:

- User profiles with usernames and bio information.
- Posts associated with each user, including titles, content, and image URLs.
- Comments on posts.
- Like relationships between users and posts.

Structure of `mock_data.json`:
```json
{
  "profiles": [{
      "id": 1,
      "username": "adventure_seeker",
      "name": "Alex Thompson",
      "content": "Exploring the world one adventure at a time",
      "image": "profilepictures/adventure_seeker.jpg",
      "posts": [{
          "id": 1,
          "title": "Scaling Mount Everest",
          "content": "Just reached base camp! The view is breathtaking.",
          "image": "placeholder_1.jpg", 
          // image field was manually placed on Cloudinary with the corresponding URL 
          // e.g. https://res.cloudinary.com/dh5lpihx1/image/upload/v1725533889/media/placeholder_1.jpg
          "likes": [2, 4, 5, 7, 9],
          "comments": [{
              "id": 1,
              "content": "Wow, what an incredible journey!",
              "user_id": 2
            },
            {
              "id": 2,
              "content": "Stay safe up there!",
              "user_id": 3
            },
            {
              "id": 3,
              "content": "The mountains look majestic!",
              "user_id": 4
            },
            {
              "id": 4,
              "content": "How's the altitude treating you?",
              "user_id": 5
            },
            {
              "id": 5,
              "content": "Living the dream, Alex!",
              "user_id": 6
            },
            {
              "id": 6,
              "content": "Can't wait to see more photos!",
              "user_id": 7
            }
          ]
        },
        // Additional posts...
}
```

## Benefits of the Populated Database

The populated database accelerates development by providing a consistent testing environment with meaningful data, enabling rapid feature development and effective demonstration of the application's capabilities.


# Environment Variables

These are covered in the `Usage and Deployment` section of the Readme.