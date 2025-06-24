# Packages/Shared - Odyssey Creator Platform (MVP - Iteration 1)

> **Essential Shared Utilities** - Core types, validation, and utilities only

## Architecture Overview

Minimal shared package providing **only essential** types, validation schemas, and utility functions needed across apps. Everything else moved to iteration 2.

## Directory Structure

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── index.ts
│   │   ├── User.ts              # ✅ Basic user types
│   │   ├── Auth.ts              # ✅ JWT/session types  
│   │   ├── API.ts               # ✅ Request/response types
│   │   └── Chat.ts              # ✅ Basic message types
│   ├── validation/
│   │   ├── index.ts
│   │   ├── userSchemas.ts       # ✅ Basic user validation
│   │   ├── authSchemas.ts       # ✅ Login/register validation
│   │   └── chatSchemas.ts       # ✅ Message validation
│   ├── utils/
│   │   ├── index.ts
│   │   ├── formatters.ts        # ✅ Date/string formatting
│   │   ├── validators.ts        # ✅ Email/password validation
│   │   └── constants.ts         # ✅ Basic app constants
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Core Types (MVP Only)

### **User Types**
```typescript
// types/User.ts
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  profilePicture?: string;
}
```

### **Auth Types** 
```typescript
// types/Auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

### **API Types**
```typescript
// types/API.ts
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
```

### **Chat Types**
```typescript
// types/Chat.ts
export interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}

export interface SendMessageRequest {
  content: string;
  userId: string;
}
```

## Validation Schemas (Minimal)

```typescript
// validation/userSchemas.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8)
});

export const UpdateUserSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  email: z.string().email().optional(),
  profilePicture: z.string().url().optional()
});
```

## Utility Functions (Essential Only)

```typescript
// utils/formatters.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// utils/validators.ts  
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// utils/constants.ts
export const APP_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_USERNAME_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 8
} as const;
```

## Dependencies

```json
{
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## MVP Features ✅

- ✅ Essential user/auth types
- ✅ Basic validation schemas  
- ✅ Core utility functions
- ✅ Simple API response types
- ✅ Minimal chat message types

## Excluded from MVP (Moved to Iteration 2) ❌

- ❌ GDPR compliance types/schemas
- ❌ Analytics and tracking types
- ❌ Multiple currency support
- ❌ Advanced content types (video/audio/live)
- ❌ Complex payment schemas
- ❌ Region/localization constants
- ❌ Advanced validation rules
- ❌ Complex data transformations
- ❌ Advanced error handling types
- ❌ Webhook/integration types

## Integration with Apps

```typescript
// Used in apps/api
import { User, CreateUserRequest, CreateUserSchema } from '@odyssey/shared';

// Used in apps/web  
import { APIResponse, Message } from '@odyssey/shared';

// Used in apps/ai
import { Message, SendMessageRequest } from '@odyssey/shared';
```

This package provides **only the absolute essentials** needed for MVP launch, with clear paths to add sophisticated features in iteration 2. 