# Authentication Package - Iteration 2: Secure B2B Auth System

## packages/auth Structure

### Project Structure
```
packages/auth/
├── src/
│   ├── models/
│   │   ├── User.cs                      # User entity model
│   │   ├── Role.cs                      # Role-based access control
│   │   ├── JwtTokens.cs                 # JWT token models
│   │   └── LoginRequest.cs              # Authentication DTOs
│   ├── services/
│   │   ├── IAuthService.cs              # Authentication interface
│   │   ├── AuthService.cs               # Core auth implementation
│   │   ├── IJwtTokenService.cs          # JWT token interface
│   │   ├── JwtTokenService.cs           # JWT token management
│   │   └── IUserService.cs              # User management interface
│   ├── middleware/
│   │   ├── JwtMiddleware.cs             # JWT validation middleware
│   │   └── RoleAuthorizationMiddleware.cs # Role-based authorization
│   ├── controllers/
│   │   ├── AuthController.cs            # Login/logout endpoints
│   │   └── UserController.cs            # User management endpoints
│   ├── data/
│   │   ├── AuthDbContext.cs             # Entity Framework context
│   │   └── migrations/                  # Database migrations
│   └── extensions/
│       └── ServiceCollectionExtensions.cs # DI container setup
├── Auth.csproj                          # Package project file
└── README.md                            # Package documentation
```

### Key Components

#### Models/User.cs
- User entity with Company association
- Email, password hash, roles
- B2B company relationship
- Account status and permissions

#### Services/AuthService.cs
- User registration and login
- Password hashing with bcrypt
- Company-based user validation
- Multi-factor authentication support

#### Services/JwtTokenService.cs
- JWT token generation and validation
- Refresh token management
- Token expiration handling
- Role-based claims

#### Middleware/JwtMiddleware.cs
- Request authentication validation
- Token extraction from headers
- User context population
- Error handling for invalid tokens

#### Controllers/AuthController.cs
- POST /auth/login
- POST /auth/register
- POST /auth/refresh
- POST /auth/logout
- Password reset endpoints

### Database Schema
- Users table with company association
- Roles table for B2B permissions
- UserRoles junction table
- RefreshTokens table
- Companies table for B2B context

### Dependencies
- Microsoft.AspNetCore.Identity
- Microsoft.EntityFrameworkCore
- System.IdentityModel.Tokens.Jwt
- BCrypt.Net-Next
- Microsoft.AspNetCore.Authentication.JwtBearer

### B2B Features
- Company-based user isolation
- Role-based access control (Admin, User, Viewer)
- Multi-tenant support
- Company subscription management
- API key management for integrations

### Security Features
- JWT with refresh tokens
- Password strength validation
- Rate limiting on auth endpoints
- HTTPS enforcement
- CORS configuration
- SQL injection prevention