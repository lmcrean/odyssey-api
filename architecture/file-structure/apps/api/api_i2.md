# API Structure - Iteration 2: Authentication Integration

## Enhanced API with Authentication

### Updated Project Structure
```
apps/api/
├── Controllers/
│   ├── HealthController.cs              # Hello World endpoint (unchanged)
│   ├── AuthController.cs                # Authentication endpoints
│   └── UserController.cs                # User management
├── Program.cs                           # Updated with auth middleware
├── appsettings.json                     # JWT and DB configuration
├── Models/
│   ├── HealthResponse.cs                # Basic response model
│   ├── AuthRequest.cs                   # Login/register DTOs
│   └── ApiResponse.cs                   # Standardized API responses
├── Middleware/
│   ├── ErrorHandlingMiddleware.cs       # Enhanced error handling
│   └── RequestLoggingMiddleware.cs      # Request logging
├── Data/
│   ├── ApplicationDbContext.cs          # Entity Framework context
│   └── Migrations/                      # Database migrations
└── Extensions/
    └── ServiceCollectionExtensions.cs   # DI container setup
```

### Key Changes for Authentication

#### Program.cs Updates
- Entity Framework configuration
- JWT authentication middleware
- Identity services registration
- Database connection string
- Authentication package integration

#### Controllers/AuthController.cs
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh-token
- POST /api/auth/logout
- Integration with packages/auth

#### Middleware Integration
- JWT validation middleware
- Role-based authorization
- User context population
- Error handling for auth failures

#### Database Configuration
- Connection string for Google Cloud SQL
- Entity Framework migrations
- User and role seeding
- Database health checks

### Configuration Updates

#### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "connection-string-here"
  },
  "JwtSettings": {
    "SecretKey": "secret-key-here",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:4200"]
  }
}
```

### Security Enhancements
- Protected endpoints with [Authorize] attribute
- Role-based access control
- HTTPS enforcement
- Input validation
- SQL injection prevention
- XSS protection

### Testing Updates
- Authentication integration tests
- JWT token validation tests
- Role-based access tests
- Database integration tests
- Mock authentication for unit tests

### Google Cloud Deployment
- Environment variables for secrets
- Cloud SQL integration
- Identity and Access Management
- Secure configuration management