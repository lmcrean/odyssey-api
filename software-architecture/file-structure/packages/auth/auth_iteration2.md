# packages/auth - Authentication & Authorization

> **JWT-based authentication** with OAuth support and session management

## Overview
Comprehensive authentication and authorization package providing both client-side and server-side utilities for secure user authentication, session management, and role-based access control.

## Tech Stack
- **jsonwebtoken** for JWT token handling
- **bcrypt** for password hashing
- **OAuth2** for third-party authentication
- **React** for client components
- **TypeScript** for type safety

## File Structure
```typescript
auth/
├── package.json       // Dependencies: jsonwebtoken, bcrypt, oauth2
├── src/
│   ├── client/       // Frontend auth utilities
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           // Main authentication hook
│   │   │   ├── useSession.ts        // Session management hook
│   │   │   ├── useOAuth.ts          // OAuth providers hook
│   │   │   ├── usePermissions.ts    // Role-based permissions hook
│   │   │   ├── useTokenRefresh.ts   // Token refresh handling
│   │   │   └── __tests__/
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      // React auth context
│   │   │   ├── SessionProvider.tsx  // Session provider component
│   │   │   ├── PermissionProvider.tsx // Permission context
│   │   │   └── __tests__/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx        // Login form component
│   │   │   ├── SignupForm.tsx       // Registration form component
│   │   │   ├── OAuthButtons.tsx     // OAuth login buttons
│   │   │   ├── GDPRConsent.tsx     // GDPR consent form
│   │   │   ├── PasswordReset.tsx    // Password reset form
│   │   │   ├── ProfileForm.tsx      // Profile editing form
│   │   │   ├── PermissionGate.tsx   // Permission-based rendering
│   │   │   └── __tests__/
│   │   ├── guards/
│   │   │   ├── AuthGuard.tsx        // Route authentication guard
│   │   │   ├── RoleGuard.tsx        // Role-based route guard
│   │   │   ├── PermissionGuard.tsx  // Permission-based guard
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── storage.ts           // Token storage utilities
│   │       ├── api.ts              // Auth API client
│   │       ├── tokenManager.ts     // Token management
│   │       ├── sessionManager.ts   // Session management
│   │       └── __tests__/
│   ├── server/       // Backend auth utilities
│   │   ├── middleware/
│   │   │   ├── authenticate.ts      // JWT verification middleware
│   │   │   ├── authorize.ts        // Role-based authorization
│   │   │   ├── rateLimit.ts        // Auth rate limiting
│   │   │   ├── gdprAuth.ts         // GDPR auth compliance
│   │   │   ├── sessionAuth.ts      // Session-based auth
│   │   │   └── __tests__/
│   │   ├── services/
│   │   │   ├── TokenService.ts      // JWT generation/validation
│   │   │   ├── PasswordService.ts   // Password hashing/validation
│   │   │   ├── OAuthService.ts      // OAuth integration
│   │   │   ├── SessionService.ts    // Session management
│   │   │   ├── PermissionService.ts // Permission management
│   │   │   ├── MFAService.ts       // Multi-factor authentication
│   │   │   └── __tests__/
│   │   ├── strategies/
│   │   │   ├── JWTStrategy.ts      // JWT authentication strategy
│   │   │   ├── OAuthStrategy.ts    // OAuth authentication strategy
│   │   │   ├── SessionStrategy.ts  // Session authentication strategy
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── jwt.ts              // JWT utilities
│   │       ├── crypto.ts           // Cryptographic functions
│   │       ├── oauth.ts            // OAuth helpers
│   │       ├── permissions.ts      // Permission utilities
│   │       └── __tests__/
│   ├── types/        // Auth-specific types
│   │   ├── AuthUser.ts             // Authenticated user types
│   │   ├── Session.ts              // Session data types
│   │   ├── OAuth.ts               // OAuth provider types
│   │   ├── Permissions.ts          // Role & permission types
│   │   ├── Token.ts               // JWT token types
│   │   ├── MFA.ts                 // Multi-factor auth types
│   │   └── index.ts
│   ├── validation/   // Auth validation schemas
│   │   ├── loginSchema.ts          // Login validation
│   │   ├── signupSchema.ts         // Registration validation
│   │   ├── passwordSchema.ts       // Password requirements
│   │   ├── gdprSchema.ts          // GDPR consent validation
│   │   ├── profileSchema.ts        // Profile validation
│   │   ├── mfaSchema.ts           // MFA validation
│   │   ├── index.ts
│   │   └── __tests__/
│   ├── constants/    // Auth constants
│   │   ├── roles.ts               // User roles definition
│   │   ├── permissions.ts         // Permission definitions
│   │   ├── providers.ts           // OAuth provider configs
│   │   ├── expiry.ts             // Token expiry settings
│   │   └── index.ts
│   └── errors/       // Auth error definitions
│       ├── AuthError.ts           // Base auth error class
│       ├── TokenError.ts          // Token-related errors
│       ├── PermissionError.ts     // Permission errors
│       ├── OAuthError.ts          // OAuth errors
│       └── index.ts
└── docs/
    ├── README.md                  // Package overview
    ├── authentication.md          // Auth implementation guide
    ├── authorization.md           // Authorization guide
    ├── oauth.md                  // OAuth integration guide
    ├── session-management.md     // Session handling guide
    └── examples/
        ├── react-integration.tsx // React usage examples
        ├── express-integration.ts // Express middleware examples
        └── oauth-setup.ts        // OAuth configuration examples
```

## Key Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Password Security**: bcrypt hashing with salt
- **Multi-factor Authentication**: TOTP and SMS support
- **OAuth Integration**: Google, GitHub, Twitter, Discord
- **Session Management**: Secure session handling
- **Token Refresh**: Automatic token renewal

### Authorization
- **Role-based Access**: User roles (Fan, Creator, Admin)
- **Permission System**: Granular permission control
- **Route Guards**: Protected route components
- **API Middleware**: Server-side authorization
- **Dynamic Permissions**: Runtime permission checking

### Security
- **Rate Limiting**: Login attempt protection
- **CSRF Protection**: Cross-site request forgery prevention
- **Session Security**: Secure session configuration
- **Password Policies**: Configurable password requirements
- **Account Lockout**: Brute force protection

### GDPR Compliance
- **Consent Management**: User consent tracking
- **Data Processing**: Purpose limitation
- **Right to Access**: User data access
- **Right to Rectification**: Data correction
- **Right to Erasure**: Account deletion

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

### Permission-based Components
```typescript
import { PermissionGate } from '@packages/auth/client';

function CreatorDashboard() {
  return (
    <PermissionGate permission="creator.dashboard.view">
      <div>
        <h1>Creator Dashboard</h1>
        <PermissionGate permission="creator.analytics.view">
          <AnalyticsSection />
        </PermissionGate>
      </div>
    </PermissionGate>
  );
}
```

### Server-side Middleware
```typescript
import { authenticate, authorize } from '@packages/auth/server';

app.get('/api/creator/dashboard', 
  authenticate,
  authorize(['creator', 'admin']),
  (req, res) => {
    // Protected route handler
    res.json({ data: 'creator dashboard data' });
  }
);
```

### OAuth Integration
```typescript
import { OAuthService } from '@packages/auth/server';

const oauthService = new OAuthService({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'https://app.com/auth/google/callback'
  }
});

app.get('/auth/google', (req, res) => {
  const authUrl = oauthService.getAuthUrl('google');
  res.redirect(authUrl);
});
```

## Configuration

### Environment Variables
```typescript
// Auth configuration
AUTH_JWT_SECRET="your-jwt-secret"
AUTH_JWT_EXPIRY="15m"
AUTH_REFRESH_SECRET="your-refresh-secret"
AUTH_REFRESH_EXPIRY="7d"

// OAuth providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

// Security settings
AUTH_RATE_LIMIT_WINDOW="15m"
AUTH_RATE_LIMIT_MAX="5"
AUTH_SESSION_SECRET="your-session-secret"
```

### Role & Permission Configuration
```typescript
import { ROLES, PERMISSIONS } from '@packages/auth/constants';

const rolePermissions = {
  [ROLES.FAN]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CREATOR_FOLLOW,
    PERMISSIONS.PAYMENT_MAKE
  ],
  [ROLES.CREATOR]: [
    ...rolePermissions[ROLES.FAN],
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.EARNINGS_VIEW
  ],
  [ROLES.ADMIN]: [
    ...rolePermissions[ROLES.CREATOR],
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.CONTENT_MODERATE,
    PERMISSIONS.PLATFORM_ADMIN
  ]
};
```

## Security Best Practices
- **Token Security**: Short-lived access tokens with refresh rotation
- **Password Requirements**: Minimum 8 characters, complexity requirements
- **Rate Limiting**: Progressive delays for failed attempts
- **Session Security**: Secure, httpOnly, sameSite cookies
- **OAuth Security**: State parameter validation, PKCE flow
- **Audit Logging**: Comprehensive authentication event logging 