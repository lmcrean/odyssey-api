# Packages - Shared Libraries Overview

> **Reusable TypeScript libraries** shared across all applications, following domain-driven design

## Structure Overview
```
packages/
├── shared/              # Core types, utilities, constants
├── auth/               # Authentication & authorization
├── ui/                 # Design system & components
├── media/              # Content processing & storage
├── observability/      # Logging, monitoring, analytics
├── security/           # Security utilities & GDPR
└── payments/           # Payment utilities & validation
```

## Detailed Breakdowns

### Core Libraries
- **[shared.md](./shared.md)** - Foundation types, utilities, and constants
- **[auth.md](./auth.md)** - Authentication and authorization utilities
- **[security.md](./security.md)** - Security utilities and GDPR compliance

### User Interface
- **[ui.md](./ui.md)** - Design system and reusable components

### Content & Media
- **[media.md](./media.md)** - Content processing and storage utilities

### Operations
- **[observability.md](./observability.md)** - Logging, monitoring, and analytics
- **[payments.md](./payments.md)** - Payment utilities and validation

## Package Philosophy
- **Single Responsibility**: Each package has a clear, focused purpose
- **TypeScript First**: Full TypeScript support with strong typing
- **Tree Shakeable**: Optimized for minimal bundle sizes
- **Framework Agnostic**: Core utilities work across different frameworks
- **Well Tested**: Comprehensive test coverage for all packages
- **Documentation**: Extensive documentation and examples

## Usage Pattern
```typescript
// Import specific utilities from packages
import { User, Creator } from '@packages/shared/types';
import { useAuth } from '@packages/auth/client';
import { Button, Modal } from '@packages/ui/components';
import { ImageOptimizer } from '@packages/media/image';
import { logger } from '@packages/observability/logging';
import { validatePayment } from '@packages/payments/validation';
```

## Cross-Package Dependencies
```
shared ← (all other packages depend on shared)
auth ← ui, observability
ui ← (frontend applications)
media ← workers, api
security ← auth, api, workers
payments ← api, workers
observability ← (all packages for logging)
``` 