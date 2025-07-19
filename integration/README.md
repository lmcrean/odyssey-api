# Integration Tests

This directory contains integration tests for the Competitor Analysis Dashboard application.

## Structure

```
integration-tests/
├── api/                    # C# ASP.NET Core API integration tests
│   ├── Tests/             # Test classes
│   ├── Fixtures/          # Test fixtures and utilities
│   └── IntegrationTests.csproj
└── web/                   # Angular frontend integration tests
    ├── src/               # Test source files
    ├── package.json       # Dependencies
    └── vitest.config.ts   # Vitest configuration
```

## API Integration Tests (C#)
- Test API endpoints with real HTTP requests
- Test database operations (when implemented)
- Test external API integrations
- Test middleware and error handling

## Web Integration Tests (Angular + Vitest)
- Test services and HTTP client interactions
- Test component integration with services
- Test routing and navigation
- Test form validation and submission

## Running Tests

### API Tests
```bash
cd integration-tests/api
dotnet test
```

### Web Tests
```bash
cd integration-tests/web
npm test
```

### All Tests
```bash
# From root directory
npm run test:integration
```

## Test Data
- Tests use isolated test data and mock external APIs
- Database tests use in-memory or test database
- HTTP tests use test server instances