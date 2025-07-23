# API Architecture - Iteration 2 (Authentication Integration)

## Overview
This document describes the C# ASP.NET Core API structure for Iteration 2, implementing a complete JWT-based authentication system for the B2B competitive intelligence platform. This builds upon the i1 foundation (basic API setup) to add secure user authentication, company management, and role-based access control.

## Project Structure

```
apps/api/
├── Controllers/
│   ├── HealthController.cs          # i1 - Basic health check
│   ├── AuthController.cs           # NEW - Authentication endpoints
│   │   ├── Login                   # POST /api/auth/login
│   │   ├── Register                # POST /api/auth/register
│   │   ├── RefreshToken            # POST /api/auth/refresh-token
│   │   ├── Logout                  # POST /api/auth/logout
│   │   ├── ForgotPassword          # POST /api/auth/forgot-password
│   │   └── ResetPassword           # POST /api/auth/reset-password
│   └── UserController.cs           # NEW - User management endpoints
│       ├── GetProfile              # GET /api/users/profile
│       ├── UpdateProfile           # PUT /api/users/profile
│       ├── ChangePassword          # POST /api/users/change-password
│       ├── DeleteAccount           # DELETE /api/users/account
│       ├── GetSessions             # GET /api/users/sessions
│       └── RevokeSession           # DELETE /api/users/sessions/{sessionId}
├── Models/
│   ├── HealthResponse.cs           # i1 - Health check model
│   └── [Auth models from packages/auth/entities/]
├── Middleware/                     # NEW
│   └── [JWT middleware from packages/auth/middleware/]
├── Properties/
│   └── launchSettings.json
├── appsettings.json                # Updated with JWT configuration
├── appsettings.Development.json
├── Program.cs                      # Updated with auth middleware
├── CompetitorAnalysis.Api.csproj  # Updated with auth package reference
└── Dockerfile                      # i1 - Multi-stage build
```

## Key Authentication Components

### Authentication Package Integration
The API references `packages/auth/` which provides:
- **Entities**: User.cs, Company.cs, RefreshToken.cs
- **Services**: IJwtTokenService, JwtTokenService, IPasswordService, PasswordService
- **Middleware**: JwtAuthMiddleware for request authentication
- **Data**: AuthDbContext with Entity Framework configurations
- **Extensions**: AuthServiceExtensions for DI setup

### JWT Configuration
```json
// appsettings.json
{
  "JwtSettings": {
    "Secret": "[Generated secure key]",
    "Issuer": "OdysseyIntelligence",
    "Audience": "OdysseyUsers",
    "AccessTokenExpiration": 15,      // minutes
    "RefreshTokenExpiration": 10080   // 7 days in minutes
  }
}
```

### Enhanced Program.cs
```csharp
// JWT Authentication
builder.Services.AddAuthenticationServices(builder.Configuration);

// CORS - Updated to support authentication
builder.Services.AddCors(options =>
{
    options.AddPolicy("WebPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials(); // Required for auth cookies
    });
});

// Add auth middleware
app.UseAuthentication();
app.UseAuthorization();
```

## Security Features

### Authentication Endpoints Security
- **Password Requirements**: Min 8 chars, mixed case, numbers, symbols
- **Rate Limiting**: 5 login attempts per minute per IP
- **Account Lockout**: 15-minute lockout after 5 failed attempts
- **Token Rotation**: Refresh tokens rotate on each use
- **CSRF Protection**: Anti-forgery tokens on state-changing operations

### Protected Endpoints
All `/api/users/*` endpoints require authentication via:
- Bearer token in Authorization header
- Valid JWT with appropriate claims
- Role-based access for admin operations

### Database Security
- **Password Storage**: Bcrypt hashing with work factor 10
- **SQL Injection Prevention**: Entity Framework parameterized queries
- **Audit Logging**: All authentication events logged
- **Data Encryption**: Sensitive data encrypted at rest

## Integration Points

### Shared Auth Package
```xml
<!-- CompetitorAnalysis.Api.csproj -->
<ItemGroup>
  <ProjectReference Include="..\..\packages\auth\CompetitorAnalysis.Auth.csproj" />
  <ProjectReference Include="..\..\packages\observability\csharp\CompetitorAnalysis.Observability.csproj" />
</ItemGroup>
```

### Database Migrations
- Auth tables created via Entity Framework migrations
- Integrated with GitHub Actions deployment workflow
- Cloud SQL database connection with SSL

### Observability Integration
- Authentication metrics exposed via `/observability/health`
- Failed login tracking and alerting
- JWT validation performance monitoring
- User session analytics

## API Response Standards

### Success Response
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    "expiresIn": 900,
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@company.com",
      "fullName": "John Smith",
      "role": "User",
      "companyId": "456e7890-e89b-12d3-a456-426614174000"
    }
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "timestamp": "2025-01-15T10:30:00Z",
    "requestId": "8a7b6c5d-4e3f-2a1b-9c8d-7e6f5a4b3c2d"
  }
}
```

## Testing Strategy

### Unit Tests
- JWT token generation and validation
- Password hashing and verification
- Service layer business logic
- Controller action results

### Integration Tests
- Complete authentication flows
- Database operations with test data
- Token refresh scenarios
- Error handling paths

### Security Tests
- Penetration testing for auth endpoints
- Token expiration validation
- Rate limiting verification
- SQL injection attempts

## Deployment Considerations

### Environment Variables
- `JWT_SECRET`: Secure key for production
- `DATABASE_URL`: Cloud SQL connection
- `CORS_ORIGINS`: Allowed frontend URLs
- `RATE_LIMIT_ENABLED`: Enable/disable rate limiting

### Google Cloud Run Configuration
- Increased memory for auth operations (512MB)
- Environment-specific secrets management
- Auto-scaling based on auth load
- Regional deployment for low latency

### Migration Strategy
1. Deploy auth package first
2. Run database migrations
3. Deploy updated API with auth
4. Verify health checks pass
5. Enable auth on frontend

## Performance Targets
- Login response: < 500ms
- Token validation: < 50ms
- Registration: < 1s
- Profile operations: < 200ms

## Next Steps (Post-i2)
- OAuth2/SSO integration (Google, Microsoft)
- Two-factor authentication (2FA)
- API key management for service accounts
- Advanced role permissions system
- Session management dashboard