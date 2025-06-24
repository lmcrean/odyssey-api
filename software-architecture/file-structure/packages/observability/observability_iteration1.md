# packages/observability - Basic Monitoring & Logging

> **Simple logging and metrics** for application monitoring

## Overview
Basic observability package providing essential logging and simple metrics collection for application monitoring. Focused on core logging functionality and basic performance tracking for MVP.

## Tech Stack
- **Winston** for structured logging
- **TypeScript** for type safety

## File Structure
```typescript
observability/
├── package.json       // Dependencies: winston
├── src/
│   ├── logging/      // Structured logging system
│   │   ├── winston/
│   │   │   ├── config.ts              // Winston configuration
│   │   │   ├── transports.ts          // Log transports (file, console)
│   │   │   ├── formatting.ts          // Log formatting and structure
│   │   │   └── __tests__/
│   │   ├── structured/
│   │   │   ├── logger.ts              // Structured logger implementation
│   │   │   ├── context.ts             // Request context logging
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── filters.ts             // Log filtering utilities
│   │       └── __tests__/
│   ├── metrics/      // Application metrics
│   │   ├── basic/
│   │   │   ├── performance.ts         // Basic performance metrics
│   │   │   ├── errors.ts              // Error rate tracking
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── collection.ts          // Metric collection utilities
│   │       └── __tests__/
│   ├── types/        // Observability types
│   │   ├── Logging.ts                  // Logging type definitions
│   │   ├── Metrics.ts                  // Metrics type definitions
│   │   └── index.ts
│   └── utils/        // Observability utilities
│       ├── helpers.ts                 // Helper functions
│       └── __tests__/
└── docs/
    ├── README.md                       // Package overview
    └── logging-guide.md                // Logging implementation guide
```

## Key Features

### Structured Logging
- **Winston Integration**: Basic logging with Winston
- **Contextual Logging**: Request correlation and context preservation
- **Log Levels**: Configurable log levels (error, warn, info, debug)
- **Structured Format**: JSON-structured logs for easy parsing

### Basic Metrics
- **Performance Tracking**: Basic response time tracking
- **Error Tracking**: Simple error rate monitoring
- **Custom Metrics**: Basic custom metric definitions

## Usage Examples

### Structured Logging
```typescript
import { Logger } from '@packages/observability/logging';

const logger = Logger.create({
  service: 'api',
  environment: 'production',
  level: 'info'
});

// Basic logging
logger.info('User login', {
  userId: 'user_123',
  timestamp: new Date()
});

// Error logging
logger.error('Payment failed', {
  error: error.message,
  paymentId: 'payment_789',
  amount: 29.99
});
```

### Basic Metrics
```typescript
import { MetricsCollector } from '@packages/observability/metrics';

const metrics = new MetricsCollector();

// Track performance
metrics.recordResponseTime('api.users.get', 150);

// Track errors
metrics.recordError('payment.process', 'CARD_DECLINED');

// Custom metrics
metrics.increment('user.signup');
```

## Dependencies
- **Winston**: ^3.10.0 - Structured logging library 