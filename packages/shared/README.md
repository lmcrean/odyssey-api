# @odyssey/shared

Shared types, interfaces, and constants for the Odyssey project.

## Overview

This package provides a single source of truth for:
- API contract interfaces (TypeScript types that mirror C# models)
- Shared constants used across frontend and tests
- Common configuration values

## Usage

### Installing

The package is installed as a local file dependency:

```json
{
  "dependencies": {
    "@odyssey/shared": "file:../../packages/shared"
  }
}
```

### Importing

```typescript
import { HealthResponse, API_MESSAGES, API_VERSION } from '@odyssey/shared';
```

## Exports

### Models
- `HealthResponse` - Interface matching the C# HealthResponse model

### Constants
- `API_MESSAGES` - Standard API response messages
- `API_VERSION` - Current API version
- `APP_TITLE` - Application title
- `API_ENDPOINTS` - API endpoint paths
- `DEFAULT_URLS` - Default URLs for different environments
- `TEST_TIMEOUTS` - Standard timeout values for tests

## Development

### Building

```bash
npm run build
```

### Cleaning

```bash
npm run clean
```

## Usage Examples

### Angular Service
```typescript
import { HealthResponse } from '@odyssey/shared';

getHealthStatus(): Observable<HealthResponse> {
  return this.http.get<HealthResponse>('/api/health/status');
}
```

### E2E Tests
```typescript
import { API_MESSAGES, API_VERSION } from '@odyssey/shared';

// Use shared constants instead of hardcoded values
expect(responseJson.message).toBe(API_MESSAGES.HEALTH_STATUS);
expect(responseJson.version).toBe(API_VERSION);
```

### Integration Tests
```typescript
import { HealthResponse, API_MESSAGES } from '@odyssey/shared';

const mockResponse: HealthResponse = {
  message: API_MESSAGES.HEALTH_STATUS,
  version: API_VERSION,
  timestamp: new Date().toISOString()
};
```

## Benefits

- **Single source of truth** for API contracts
- **Type safety** across frontend and tests
- **Easier maintenance** - update types in one place
- **Better documentation** - centralized API contracts
- **Prevents drift** between frontend expectations and backend reality