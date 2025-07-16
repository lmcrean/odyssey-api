# API Structure - Iteration 1: Hello World Foundation

## C# ASP.NET Core API Setup

### Project Structure
```
apps/api/
├── Controllers/
│   └── HealthController.cs          # Hello World endpoint
├── Program.cs                       # Application entry point
├── appsettings.json                 # Configuration
├── appsettings.Development.json     # Dev config
├── CompetitorAnalysis.Api.csproj    # Project file
├── Properties/
│   └── launchSettings.json          # Launch configuration
├── Models/
│   └── HealthResponse.cs            # Basic response model
└── Middleware/
    └── ErrorHandlingMiddleware.cs   # Basic error handling
```

### Key Files for Iteration 1

#### Program.cs
- Configure ASP.NET Core minimal API
- Add CORS for Angular frontend
- Configure logging
- Setup dependency injection
- Configure for Google Cloud Run deployment

#### Controllers/HealthController.cs
- GET /health endpoint returning "Hello World"
- GET /api/health/status with structured response
- Basic API versioning setup

#### Models/HealthResponse.cs
- Simple response model for structured JSON
- Version information
- Timestamp

### Dependencies (.csproj)
- Microsoft.AspNetCore.App
- Microsoft.Extensions.Logging
- Swashbuckle.AspNetCore (Swagger)
- Microsoft.AspNetCore.Cors

### Configuration
- Environment-specific settings
- Database connection (prepare for future)
- CORS origins for localhost:4200 (Angular dev)
- Logging configuration

### Google Cloud Deployment Prep
- Dockerfile for Cloud Run
- Cloud Build configuration
- Health check endpoints
- Port configuration (8080 for Cloud Run)

### Testing Setup
- Basic integration test project
- Test hello world endpoint
- Health check validation