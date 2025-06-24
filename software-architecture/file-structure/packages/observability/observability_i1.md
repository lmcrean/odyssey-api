# Packages/Observability - Odyssey Creator Platform (MVP - Iteration 1)

> **Basic Logging** - Simple console logging for development and basic error tracking

## Architecture Overview

Minimal observability package providing **only essential** logging functionality for MVP launch. All advanced monitoring and analytics moved to iteration 2.

## Directory Structure

```
packages/observability/
├── src/
│   ├── logger/
│   │   ├── Logger.ts               # ✅ Basic console logger
│   │   ├── types.ts                # ✅ Log level types
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts           # ✅ Log formatting
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Basic Logging Features

### **Simple Logger**
```typescript
// logger/Logger.ts
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
}

export class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(this.formatLog(LogLevel.DEBUG, message, data));
    }
  }

  info(message: string, data?: any): void {
    console.info(this.formatLog(LogLevel.INFO, message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatLog(LogLevel.WARN, message, data));
  }

  error(message: string, error?: Error | any): void {
    console.error(this.formatLog(LogLevel.ERROR, message, error));
  }

  private formatLog(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${dataStr}`;
  }
}

// Create singleton instance
export const logger = new Logger();
```

### **Log Types**
```typescript
// logger/types.ts
export { LogLevel, LogEntry } from './Logger';

export interface ErrorLog {
  message: string;
  stack?: string;
  userId?: string;
  endpoint?: string;
}

export interface RequestLog {
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  userId?: string;
}
```

### **Formatters**
```typescript
// utils/formatters.ts
export function formatError(error: Error): ErrorLog {
  return {
    message: error.message,
    stack: error.stack,
  };
}

export function formatRequest(
  method: string,
  url: string,
  statusCode: number,
  startTime: number,
  userId?: string
): RequestLog {
  return {
    method,
    url,
    statusCode,
    duration: Date.now() - startTime,
    userId
  };
}
```

## Dependencies

```json
{
  "dependencies": {},
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## MVP Features ✅

- ✅ Basic console logging (debug, info, warn, error)
- ✅ Simple log formatting with timestamps
- ✅ Development vs production log levels
- ✅ Error and request log types
- ✅ JSON serialization for log data
- ✅ Singleton logger instance

## Excluded from MVP (Moved to Iteration 2) ❌

- ❌ Advanced metrics collection
- ❌ APM (Application Performance Monitoring)
- ❌ Distributed tracing
- ❌ Real-time dashboards
- ❌ Log aggregation and storage
- ❌ Error tracking services (Sentry)
- ❌ Performance monitoring
- ❌ Custom metrics and counters
- ❌ Log shipping to external services
- ❌ Structured logging with correlation IDs
- ❌ Health check endpoints
- ❌ Alerting and notifications
- ❌ Uptime monitoring

## Usage Examples

### **Backend (Express)**
```typescript
// In apps/api
import { logger } from '@odyssey/observability';

// Basic logging
logger.info('Server starting on port 3000');
logger.debug('Database connection established');

// Error logging
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', error);
  throw error;
}

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});
```

### **Frontend (React)**
```typescript
// In apps/web
import { logger } from '@odyssey/observability';

// Component logging
function UserProfile({ userId }: { userId: string }) {
  useEffect(() => {
    logger.debug('UserProfile component mounted', { userId });
    
    return () => {
      logger.debug('UserProfile component unmounted', { userId });
    };
  }, [userId]);

  const handleSave = async () => {
    try {
      logger.info('Saving user profile', { userId });
      await saveProfile();
      logger.info('Profile saved successfully', { userId });
    } catch (error) {
      logger.error('Failed to save profile', error);
    }
  };

  return <div>Profile content...</div>;
}
```

### **API Endpoints**
```typescript
// In apps/api routes
import { logger } from '@odyssey/observability';

export async function loginController(req: Request, res: Response) {
  const { email } = req.body;
  
  logger.info('Login attempt', { email });
  
  try {
    const user = await authenticateUser(email, password);
    logger.info('Login successful', { userId: user.id, email });
    
    res.json({ user, token });
  } catch (error) {
    logger.warn('Login failed', { email, error: error.message });
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
```

This package provides **only the absolute minimum** observability needed for MVP development and basic error tracking, with clear console output for debugging. 