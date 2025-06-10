# User API Documentation

## Overview

The User API provides unified user account and profile management functionality. This implementation merges traditional User and Profile models into a single, cohesive User model that includes all profile-related fields.

## Architecture

Following the app-centric organization pattern:
- **Models**: Database operations (`UserModel`)
- **Services**: Business logic (`UserService`)
- **Routes**: HTTP endpoints with dedicated Route.ts and Controller.ts files
- **Types**: TypeScript interfaces for type safety

## Unified User Model

The User model includes both account and profile information:

```typescript
interface User {
  // Account fields
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  
  // Profile fields
  profileBio?: string;
  profilePicture?: string;
  profileName?: string;
  profileLocation?: string;
  profileWebsite?: string;
  profileBirthdate?: Date;
  profilePrivate?: boolean;
  
  // Social counts
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
}
```

## API Endpoints

### 1. Get User Profile
**GET** `/users/profile`

Get the authenticated user's complete profile information.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "profileName": "John Doe",
    "profileBio": "Software developer passionate about technology",
    "profilePicture": "https://example.com/avatar.jpg",
    "profileLocation": "San Francisco, CA",
    "profileWebsite": "https://johndoe.dev",
    "profilePrivate": false,
    "postsCount": 42,
    "followersCount": 150,
    "followingCount": 89,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "lastActiveAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Update User Profile
**PUT** `/users/profile/update`

Update the authenticated user's profile information.

**Authentication**: Required

**Request Body**:
```json
{
  "username": "newusername",
  "firstName": "John",
  "lastName": "Doe",
  "profileName": "John Doe",
  "profileBio": "Updated bio",
  "profilePicture": "https://example.com/new-avatar.jpg",
  "profileLocation": "New York, NY",
  "profileWebsite": "https://johndoe.com",
  "profileBirthdate": "1990-01-01T00:00:00Z",
  "profilePrivate": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated user object
  }
}
```

**Error Responses**:
- `409 Conflict`: Username already taken
- `400 Bad Request`: Invalid username format or website URL

### 3. Get Public Profile
**GET** `/users/public/:identifier`

Get a user's public profile by username or user ID.

**Parameters**:
- `identifier`: Username or user UUID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "username": "johndoe",
    "profileName": "John Doe",
    "profileBio": "Software developer",
    "profilePicture": "https://example.com/avatar.jpg",
    "profileLocation": "San Francisco, CA",
    "profileWebsite": "https://johndoe.dev",
    "postsCount": 42,
    "followersCount": 150,
    "followingCount": 89,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastActiveAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Search Users
**GET** `/users/search?q=query&limit=20`

Search for users by username or profile name.

**Query Parameters**:
- `q`: Search query (minimum 2 characters)
- `limit`: Maximum results (default: 20, max: 50)

**Response**:
```json
{
  "success": true,
  "data": {
    "query": "john",
    "results": [
      {
        "id": "user-uuid",
        "username": "johndoe",
        "profileName": "John Doe",
        "profilePicture": "https://example.com/avatar.jpg",
        "profileBio": "Software developer",
        "followersCount": 150
      }
    ],
    "count": 1
  }
}
```

### 5. Check Username Availability
**GET** `/users/check-username/:username`

Check if a username is available for registration or update.

**Parameters**:
- `username`: Username to check (3-30 characters, alphanumeric + underscores)

**Response**:
```json
{
  "success": true,
  "data": {
    "username": "johndoe",
    "available": false,
    "message": "Username is already taken"
  }
}
```

## Benefits of Unified Model

### 1. **Simplified Architecture**
- Single model instead of separate User + Profile models
- Reduced complexity in relationships and joins
- Easier to understand and maintain

### 2. **Better Performance**
- No need for complex joins between User and Profile tables
- Single database query for complete user information
- Reduced API calls for frontend applications

### 3. **Consistent Data Structure**
- All user-related information in one place
- Consistent field naming with `profile` prefix for profile-specific fields
- Clear separation between account and profile data

### 4. **Easier Development**
- Single source of truth for user information
- Simplified validation and business logic
- Reduced boilerplate code

## Field Naming Convention

Profile-specific fields use the `profile` prefix to maintain clarity:
- `profileBio` instead of `bio`
- `profilePicture` instead of `avatar` or `picture`
- `profileName` for display name (different from `username`)
- `profileLocation`, `profileWebsite`, etc.

## Security Considerations

- **Public vs Private**: The `PublicUserProfile` interface excludes sensitive fields like email
- **Authentication**: Profile modification requires authentication
- **Validation**: Username format validation and availability checking
- **URL Validation**: Website URLs are validated before saving

## Database Schema

The unified User table should include all fields from the User interface:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  
  -- Profile fields
  profile_bio TEXT,
  profile_picture VARCHAR(500),
  profile_name VARCHAR(100),
  profile_location VARCHAR(100),
  profile_website VARCHAR(500),
  profile_birthdate DATE,
  profile_private BOOLEAN DEFAULT false,
  
  -- Social counts (can be computed or cached)
  posts_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE
);
```

## Migration from Separate Models

If migrating from separate User and Profile models:

1. **Data Migration**: Merge Profile data into User table
2. **Update Queries**: Modify existing queries to use unified model
3. **API Compatibility**: Maintain backward compatibility during transition
4. **Frontend Updates**: Update frontend to use new unified endpoints

## Testing

Each endpoint should be tested for:
- **Authentication**: Proper authentication handling
- **Validation**: Input validation and error responses
- **Business Logic**: Username availability, URL validation, etc.
- **Data Integrity**: Proper data saving and retrieval
- **Security**: Public vs private data exposure 