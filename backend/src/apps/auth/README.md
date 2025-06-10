# Auth App

This directory contains the authentication functionality for the Odyssey API, organized following the app-centric backend architecture.

## Structure

```
auth/
├── models/          # Data models for user management
├── routes/          # Authentication endpoints
│   ├── login/       # POST /auth/login
│   ├── register/    # POST /auth/register
│   ├── logout/      # POST /auth/logout
│   └── refresh-token/ # POST /auth/refresh-token
├── services/        # Business logic services
├── types/           # TypeScript interfaces
└── README.md
```

## Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### POST /auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### POST /auth/refresh-token
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

### POST /auth/logout
Logout user (client-side token removal).

## Services

- **AuthService**: Core authentication logic, token generation/verification
- **ValidationService**: Input validation for auth operations

## Models

- **UserModel**: Database operations for user management (TODO: implement with actual DB)

## Middleware

Authentication middleware is available in `src/shared/middleware/auth.ts`:
- `authenticateToken`: Require valid JWT token
- `optionalAuth`: Optional authentication for public endpoints

## Usage Example

```typescript
import { authenticateToken } from '../shared/middleware/auth';

// Protect a route
router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains authenticated user info
});
```

## TODO

- [ ] Implement actual database operations in UserModel
- [ ] Add email verification functionality
- [ ] Add password reset functionality
- [ ] Add rate limiting for auth endpoints
- [ ] Add refresh token blacklisting
- [ ] Add comprehensive tests 