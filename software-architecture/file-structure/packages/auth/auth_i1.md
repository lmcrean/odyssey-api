# packages/auth - Authentication & Authorization

> **JWT-based authentication** for basic user management

## Overview
Basic authentication package providing essential user authentication with JWT tokens, password security, and simple session management. Focused on core auth functionality for MVP.

## Tech Stack
- **jsonwebtoken** for JWT token handling
- **bcrypt** for password hashing
- **React** for client components
- **TypeScript** for type safety

## File Structure
```typescript
auth/
├── package.json       // Dependencies: jsonwebtoken, bcrypt
├── src/
│   ├── client/       // Frontend auth utilities
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           // Main authentication hook
│   │   │   ├── useSession.ts        // Session management hook
│   │   │   └── __tests__/
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      // React auth context
│   │   │   ├── SessionProvider.tsx  // Session provider component
│   │   │   └── __tests__/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx        // Login form component
│   │   │   ├── SignupForm.tsx       // Registration form component
│   │   │   ├── PasswordReset.tsx    // Password reset form
│   │   │   └── __tests__/
│   │   ├── guards/
│   │   │   ├── AuthGuard.tsx        // Route authentication guard
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── storage.ts           // Token storage utilities
│   │       ├── api.ts              // Auth API client
│   │       ├── tokenManager.ts     // Token management
│   │       └── __tests__/
│   ├── server/       // Backend auth utilities
│   │   ├── middleware/
│   │   │   ├── authenticate.ts      // JWT verification middleware
│   │   │   ├── rateLimit.ts        // Basic auth rate limiting
│   │   │   └── __tests__/
│   │   ├── services/
│   │   │   ├── TokenService.ts      // JWT generation/validation
│   │   │   ├── PasswordService.ts   // Password hashing/validation
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── jwt.ts              // JWT utilities
│   │       ├── crypto.ts           // Basic cryptographic functions
│   │       └── __tests__/
│   ├── types/        // Auth-specific types
│   │   ├── AuthUser.ts             // Authenticated user types
│   │   ├── Session.ts              // Session data types
│   │   ├── Token.ts               // JWT token types
│   │   └── index.ts
│   ├── validation/   // Auth validation schemas
│   │   ├── loginSchema.ts          // Login validation
│   │   ├── signupSchema.ts         // Registration validation
│   │   ├── passwordSchema.ts       // Password requirements
│   │   ├── index.ts
│   │   └── __tests__/
│   ├── constants/    // Auth constants
│   │   ├── roles.ts               // Basic user roles (user, admin)
│   │   ├── expiry.ts             // Token expiry settings
│   │   └── index.ts
│   └── errors/       // Auth error definitions
│       ├── AuthError.ts           // Base auth error class
│       ├── TokenError.ts          // Token-related errors
│       └── index.ts
└── docs/
    ├── README.md                  // Package overview
    ├── authentication.md          // Auth implementation guide
    └── examples/
        ├── react-integration.tsx // React usage examples
        └── express-integration.ts // Express middleware examples
```

## Key Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Password Security**: bcrypt hashing with salt
- **Session Management**: Basic session handling
- **Token Refresh**: Simple token renewal

### Authorization
- **Basic Roles**: User and admin roles
- **Route Guards**: Protected route components
- **API Middleware**: Server-side authentication

### Security
- **Rate Limiting**: Login attempt protection
- **Password Policies**: Basic password requirements

## Usage Examples

### Client-side Authentication
```typescript
import { useAuth } from '@packages/auth/client';

function LoginPage() {
  const { login, user, isLoading, error } = useAuth();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      // User is now authenticated
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <LoginForm onSubmit={handleLogin} />
      )}
    </div>
  );
}
```

### Server-side Middleware
```typescript
import { authenticate } from '@packages/auth/server';

app.get('/api/protected', 
  authenticate,
  (req, res) => {
    // Protected route handler
    res.json({ message: 'Authenticated user data', user: req.user });
  }
);
```

## Configuration

### Environment Variables
```typescript
// Auth configuration
AUTH_JWT_SECRET="your-jwt-secret"
AUTH_JWT_EXPIRY="15m"
AUTH_REFRESH_SECRET="your-refresh-secret"
AUTH_REFRESH_EXPIRY="7d"

// Security settings
AUTH_RATE_LIMIT_WINDOW="15m"
AUTH_RATE_LIMIT_MAX="5"
```

### Role Configuration
```typescript
import { ROLES } from '@packages/auth/constants';

const rolePermissions = {
  [ROLES.USER]: ['profile.view', 'profile.edit'],
  [ROLES.ADMIN]: ['all']
};
```

## Security Best Practices
- **Token Security**: Short-lived access tokens with refresh rotation
- **Password Requirements**: Minimum 8 characters, complexity requirements
- **Rate Limiting**: Progressive delays for failed attempts 