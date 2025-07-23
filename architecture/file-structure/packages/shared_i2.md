# Shared Package - Iteration 2: Authentication Types Extension

## packages/shared Structure

### Project Structure
```
packages/shared/
├── src/
│   ├── models/
│   │   ├── health-response.ts            # Existing health response model
│   │   ├── user.model.ts                 # User interface and DTOs
│   │   ├── auth.model.ts                 # Authentication request/response types
│   │   ├── role.model.ts                 # Role and permission interfaces
│   │   └── api-response.model.ts         # Standardized API response wrapper
│   ├── constants/
│   │   ├── api.constants.ts              # Enhanced with auth endpoints
│   │   ├── auth.constants.ts             # Authentication-specific constants
│   │   └── validation.constants.ts       # Form validation constants
│   └── index.ts                          # Updated exports
├── package.json                          # Enhanced dependencies
├── tsconfig.json                         # TypeScript configuration
└── README.md                             # Package documentation
```

### Enhanced Models

#### models/user.model.ts
- User interface with company association
- UserDto for API requests/responses
- UserProfile for frontend display
- Company interface for B2B context
- User registration and login DTOs

#### models/auth.model.ts
- LoginRequest and LoginResponse interfaces
- RegisterRequest and RegisterResponse interfaces
- JwtTokenResponse with access and refresh tokens
- AuthUser interface for authenticated user state
- Password reset request/response types

#### models/role.model.ts
- Role interface with permissions
- Permission enum for fine-grained access control
- UserRole interface for user-role associations
- Company-specific role definitions
- B2B access level constants

#### models/api-response.model.ts
- Generic ApiResponse<T> wrapper
- Error response interface
- Pagination interfaces
- Success/failure response types
- HTTP status code constants

### Enhanced Constants

#### constants/auth.constants.ts
- Authentication endpoints
- Token storage keys
- Session timeout values
- Password validation rules
- Role-based access constants

#### constants/validation.constants.ts
- Form validation patterns (email, password)
- Error messages for validation
- Input length constraints
- Company name validation rules
- Registration field requirements

### Updated API Constants

#### constants/api.constants.ts
```typescript
// Enhanced API Endpoints
export const API_ENDPOINTS = {
  // Health endpoints (existing)
  HEALTH: '/api/health',
  HEALTH_STATUS: '/api/health/status',
  ROOT: '/',
  
  // Authentication endpoints (new)
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  
  // User management endpoints (new)
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    CHANGE_PASSWORD: '/api/users/change-password'
  }
} as const;
```

### Key Features

#### Type Safety
- Shared interfaces between Angular frontend and C# backend
- Consistent data models across the application
- TypeScript strict mode compliance
- Generic response wrappers for API consistency

#### Authentication Support
- JWT token interfaces matching C# models
- User registration and login flow types
- Role-based access control interfaces
- Company-based user isolation types

#### Form Validation
- Shared validation constants and patterns
- Consistent error messaging
- Password strength requirements
- Email format validation

#### API Consistency
- Standardized request/response interfaces
- Error handling types
- HTTP status code constants
- Pagination support

### Dependencies
```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "rimraf": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Usage Examples

#### Frontend Service
```typescript
import { LoginRequest, LoginResponse, ApiResponse } from '@odyssey/shared';

// Type-safe API calls
login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
  return this.http.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, request);
}
```

#### Backend Controller
```csharp
// C# models match TypeScript interfaces
[HttpPost("login")]
public async Task<ApiResponse<LoginResponse>> Login([FromBody] LoginRequest request)
{
    // Implementation uses shared interface structure
}
```

### Integration Points
- **apps/api**: C# models mirror TypeScript interfaces
- **apps/web**: Angular services use shared types
- **packages/auth**: Authentication package references shared types
- **integration-tests**: Tests use shared interfaces for consistency
- **e2e**: Playwright tests use shared constants for endpoints

This shared package extension ensures type safety and consistency across the entire authentication system while maintaining the existing health check functionality.