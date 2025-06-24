# Packages/Auth - Odyssey Creator Platform (MVP - Iteration 1)

> **Basic Authentication** - Simple JWT-based authentication with minimal features

## Architecture Overview

Minimal authentication package providing **only essential** JWT authentication functionality for MVP launch. All advanced auth features moved to iteration 2.

## Directory Structure

```
packages/auth/
├── src/
│   ├── jwt/
│   │   ├── generateToken.ts        # ✅ Basic JWT generation
│   │   ├── verifyToken.ts          # ✅ Basic JWT verification
│   │   └── index.ts
│   ├── middleware/
│   │   ├── requireAuth.ts          # ✅ Basic auth middleware
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts              # ✅ Basic auth hook
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.ts                 # ✅ Basic auth types
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Core Authentication Features

### **JWT Utilities**
```typescript
// jwt/generateToken.ts
export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  });
}

// jwt/verifyToken.ts
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

### **Basic Middleware**
```typescript
// middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### **React Hook**
```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  userId: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Basic token validation - just check if exists
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}
```

### **Basic Types**
```typescript
// types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    userId: string;
    email: string;
    username: string;
  };
  token: string;
}

export interface AuthError {
  message: string;
  code: string;
}
```

## Dependencies

```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.0",
    "react": "^18.0.0"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

## MVP Features ✅

- ✅ Basic JWT token generation/verification
- ✅ Simple auth middleware for Express
- ✅ Basic React auth hook
- ✅ LocalStorage token management
- ✅ Essential auth types
- ✅ 24-hour token expiration

## Excluded from MVP (Moved to Iteration 2) ❌

- ❌ OAuth integration (Google, GitHub, etc.)
- ❌ Advanced rate limiting and security
- ❌ Refresh token management
- ❌ Session management and persistence
- ❌ Password reset functionality
- ❌ Email verification
- ❌ Multi-factor authentication (MFA)
- ❌ Advanced security headers
- ❌ IP-based restrictions
- ❌ Account lockout mechanisms
- ❌ Advanced token management
- ❌ SSO integration
- ❌ Role-based access control (RBAC)
- ❌ Audit logging

## Usage Examples

### **Backend (Express)**
```typescript
// In apps/api
import { requireAuth, generateToken } from '@odyssey/auth';

// Protected route
app.get('/api/profile', requireAuth, (req: AuthRequest, res) => {
  // req.user is available
  res.json({ user: req.user });
});

// Login endpoint  
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials (simplified)
  const user = await findUserByEmail(email);
  if (user && await verifyPassword(password, user.password)) {
    const token = generateToken({
      userId: user.id,
      email: user.email
    });
    
    res.json({
      user: { userId: user.id, email: user.email, username: user.username },
      token
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

### **Frontend (React)**
```typescript
// In apps/web
import { useAuth } from '@odyssey/auth';

function App() {
  const { user, loading, login, logout, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

This package provides **only the absolute essentials** for authentication, focusing on getting users logged in and protected routes working with minimal complexity. 