# Odyssey Authentication Package

This package provides authentication services, entities, and controllers for the Odyssey B2B competitive intelligence platform.

## Structure

```
packages/auth/
├── entities/               # C# database entities
│   ├── User.cs            # User entity with company relationship
│   ├── Company.cs         # Company entity for B2B tenancy
│   ├── RefreshToken.cs    # JWT refresh token entity
│   ├── UserRole.cs        # User role enumeration
│   └── SubscriptionPlan.cs # Company subscription plans
├── data/                  # Entity Framework configuration
│   ├── AuthDbContext.cs   # Database context
│   └── configurations/    # Entity configurations
├── services/              # Business logic services
│   ├── interfaces/        # Service interfaces
│   └── implementations/   # Service implementations
├── controllers/           # API controllers
│   ├── AuthController.cs  # Authentication endpoints
│   └── UserController.cs  # User management endpoints
├── models/                # Request/response DTOs
├── src/                   # TypeScript type definitions
└── migrations/            # Database migration documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

## Database Migrations

To set up the database schema, run the following Entity Framework Core commands from the main API project:

```bash
# Navigate to the API project
cd apps/api

# Add initial migration
dotnet ef migrations add InitialAuthSchema --project ../../packages/auth --context AuthDbContext

# Update database
dotnet ef database update --project ../../packages/auth --context AuthDbContext
```

## Environment Variables

For production deployment, set the following environment variables:

- `DB_HOST` - Database host
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET_KEY` - JWT signing secret key (minimum 32 characters)

## Security Features

- JWT tokens with 15-minute expiration
- Refresh token rotation
- BCrypt password hashing
- Role-based access control
- Multi-tenant B2B support
- Input validation and sanitization

## Usage

Add the package reference to your API project:

```xml
<ProjectReference Include="..\..\packages\auth\CompetitorAnalysis.Auth.csproj" />
```

Configure services in Program.cs:

```csharp
// Add Entity Framework and Auth services
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IUserService, UserService>();
```