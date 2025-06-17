# packages/security - Security & GDPR Compliance

> **Security utilities** and GDPR compliance tools

## Overview
Comprehensive security package providing authentication security, input validation, GDPR compliance tools, rate limiting, data encryption, and security monitoring for the creator monetization platform. Built with security-first principles and regulatory compliance in mind.

## Tech Stack
- **Helmet** for HTTP security headers
- **express-rate-limit** for rate limiting
- **crypto** for encryption utilities
- **joi** for input validation
- **bcrypt** for password hashing
- **jsonwebtoken** for JWT security
- **TypeScript** for type safety

## File Structure
```typescript
security/
├── package.json       // Dependencies: helmet, express-rate-limit, crypto
├── src/
│   ├── auth/         // Authentication security
│   │   ├── csrf/
│   │   │   ├── protection.ts          // CSRF protection middleware
│   │   │   ├── tokens.ts              // CSRF token management
│   │   │   ├── validation.ts          // CSRF token validation
│   │   │   └── __tests__/
│   │   ├── session/
│   │   │   ├── security.ts            // Session security configuration
│   │   │   ├── management.ts          // Session lifecycle management
│   │   │   ├── storage.ts             // Secure session storage
│   │   │   └── __tests__/
│   │   ├── password/
│   │   │   ├── policies.ts            // Password policy enforcement
│   │   │   ├── strength.ts            // Password strength validation
│   │   │   ├── history.ts             // Password history tracking
│   │   │   └── __tests__/
│   │   ├── mfa/
│   │   │   ├── totp.ts                // Time-based OTP implementation
│   │   │   ├── sms.ts                 // SMS-based MFA
│   │   │   ├── email.ts               // Email-based MFA
│   │   │   └── __tests__/
│   │   └── tokens/
│   │       ├── jwt.ts                 // JWT security utilities
│   │       ├── refresh.ts             // Refresh token security
│   │       ├── blacklist.ts           // Token blacklisting
│   │       └── __tests__/
│   ├── input/        // Input validation & sanitization
│   │   ├── validation/
│   │   │   ├── schemas.ts             // Validation schemas
│   │   │   ├── middleware.ts          // Validation middleware
│   │   │   ├── custom.ts              // Custom validators
│   │   │   └── __tests__/
│   │   ├── sanitization/
│   │   │   ├── html.ts                // HTML sanitization
│   │   │   ├── sql.ts                 // SQL injection prevention
│   │   │   ├── xss.ts                 // XSS prevention
│   │   │   └── __tests__/
│   │   └── filtering/
│   │       ├── content.ts             // Content filtering
│   │       ├── profanity.ts           // Profanity filtering
│   │       ├── spam.ts                // Spam detection
│   │       └── __tests__/
│   ├── gdpr/         // GDPR compliance tools
│   │   ├── consent/
│   │   │   ├── management.ts          // Consent management system
│   │   │   ├── tracking.ts            // Consent tracking
│   │   │   ├── withdrawal.ts          // Consent withdrawal
│   │   │   └── __tests__/
│   │   ├── data-subject-rights/
│   │   │   ├── access.ts              // Right to access implementation
│   │   │   ├── rectification.ts       // Right to rectification
│   │   │   ├── erasure.ts             // Right to erasure (deletion)
│   │   │   ├── portability.ts         // Data portability
│   │   │   └── __tests__/
│   │   ├── privacy/
│   │   │   ├── by-design.ts           // Privacy by design implementation
│   │   │   ├── impact-assessment.ts   // Privacy impact assessments
│   │   │   ├── breach-notification.ts // Breach notification system
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── anonymization.ts       // Data anonymization
│   │       ├── pseudonymization.ts    // Data pseudonymization
│   │       ├── classification.ts      // Data classification
│   │       └── __tests__/
│   ├── rate-limiting/ // Rate limiting system
│   │   ├── strategies/
│   │   │   ├── fixed-window.ts        // Fixed window rate limiting
│   │   │   ├── sliding-window.ts      // Sliding window rate limiting
│   │   │   ├── token-bucket.ts        // Token bucket algorithm
│   │   │   └── __tests__/
│   │   ├── middleware/
│   │   │   ├── api.ts                 // API rate limiting middleware
│   │   │   ├── auth.ts                // Authentication rate limiting
│   │   │   ├── upload.ts              // File upload rate limiting
│   │   │   └── __tests__/
│   │   └── storage/
│   │       ├── redis.ts               // Redis-based rate limiting
│   │       ├── memory.ts              // In-memory rate limiting
│   │       └── __tests__/
│   ├── encryption/   // Data encryption utilities
│   │   ├── symmetric/
│   │   │   ├── aes.ts                 // AES encryption implementation
│   │   │   ├── key-management.ts      // Symmetric key management
│   │   │   └── __tests__/
│   │   ├── asymmetric/
│   │   │   ├── rsa.ts                 // RSA encryption implementation
│   │   │   ├── key-pairs.ts           // Key pair generation
│   │   │   └── __tests__/
│   │   ├── hashing/
│   │   │   ├── password.ts            // Password hashing (bcrypt, argon2)
│   │   │   ├── data.ts                // Data integrity hashing
│   │   │   └── __tests__/
│   │   └── field-level/
│   │       ├── database.ts            // Database field encryption
│   │       ├── pii.ts                 // PII data encryption
│   │       └── __tests__/
│   ├── monitoring/   // Security monitoring
│   │   ├── threat-detection/
│   │   │   ├── anomaly.ts             // Anomaly detection
│   │   │   ├── behavioral.ts          // Behavioral analysis
│   │   │   └── __tests__/
│   │   ├── logging/
│   │   │   ├── security-events.ts     // Security event logging
│   │   │   ├── audit-trail.ts         // Audit trail implementation
│   │   │   └── __tests__/
│   │   └── alerting/
│   │       ├── real-time.ts           // Real-time security alerts
│   │       ├── escalation.ts          // Alert escalation
│   │       └── __tests__/
│   ├── headers/      // HTTP security headers
│   │   ├── helmet/
│   │   │   ├── config.ts              // Helmet configuration
│   │   │   ├── custom.ts              // Custom security headers
│   │   │   └── __tests__/
│   │   ├── cors/
│   │   │   ├── config.ts              // CORS configuration
│   │   │   ├── dynamic.ts             // Dynamic CORS handling
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── validation.ts          // Header validation
│   │       └── __tests__/
│   ├── access-control/ // Access control system
│   │   ├── rbac/
│   │   │   ├── roles.ts               // Role-based access control
│   │   │   ├── permissions.ts         // Permission management
│   │   │   └── __tests__/
│   │   ├── middleware/
│   │   │   ├── authorization.ts       // Authorization middleware
│   │   │   ├── resource.ts            // Resource-based authorization
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── policy-engine.ts       // Policy evaluation engine
│   │       └── __tests__/
│   ├── types/        // Security type definitions
│   │   ├── Auth.ts                    // Authentication types
│   │   ├── GDPR.ts                    // GDPR compliance types
│   │   ├── Encryption.ts              // Encryption types
│   │   ├── RateLimit.ts               // Rate limiting types
│   │   ├── Monitoring.ts              // Security monitoring types
│   │   └── index.ts
│   └── utils/        // Security utilities
│       ├── constants.ts               // Security constants
│       ├── helpers.ts                 // Security helper functions
│       ├── validators.ts              // Security validators
│       └── __tests__/
└── docs/
    ├── README.md                      // Package overview
    ├── authentication-security.md     // Auth security guide
    ├── input-validation.md            // Input validation guide
    ├── gdpr-compliance.md             // GDPR compliance guide
    ├── encryption-guide.md            // Encryption implementation guide
    └── rate-limiting-guide.md         // Rate limiting guide
```

## Key Features

### Authentication Security
- **CSRF Protection**: Cross-site request forgery prevention
- **Session Security**: Secure session management and storage
- **Password Policies**: Configurable password strength requirements
- **Multi-factor Authentication**: TOTP, SMS, and email-based MFA
- **Token Security**: JWT security with blacklisting and rotation
- **Brute Force Protection**: Account lockout and timing attack prevention

### Input Validation & Sanitization
- **Schema Validation**: Comprehensive input validation with Joi
- **HTML Sanitization**: XSS prevention through HTML sanitization
- **SQL Injection Prevention**: Parameterized query enforcement
- **Content Filtering**: Spam and malicious content detection
- **File Upload Security**: Secure file upload validation

### GDPR Compliance
- **Consent Management**: Granular consent tracking and management
- **Data Subject Rights**: Complete implementation of GDPR rights
- **Privacy by Design**: Built-in privacy protection mechanisms
- **Breach Notification**: Automated breach detection and notification
- **Cookie Compliance**: GDPR-compliant cookie management

### Rate Limiting
- **Multiple Algorithms**: Fixed window, sliding window, token bucket
- **Adaptive Limiting**: Dynamic rate limiting based on user behavior
- **Multiple Storage Options**: Redis, in-memory, and database backends
- **Granular Control**: API, authentication, upload rate limiting

### Data Encryption
- **Symmetric Encryption**: AES implementations
- **Asymmetric Encryption**: RSA encryption
- **Field-level Encryption**: Database field and PII encryption
- **Key Management**: Secure key generation, storage, and rotation
- **Hashing**: Password hashing with bcrypt and Argon2

### Security Monitoring
- **Threat Detection**: Anomaly and behavioral analysis
- **Security Logging**: Comprehensive security event logging
- **Real-time Alerting**: Immediate threat response and escalation

## Usage Examples

### CSRF Protection
```typescript
import { CSRFProtection } from '@packages/security/auth';

const csrfProtection = CSRFProtection.create({
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

// Apply to Express app
app.use(csrfProtection.middleware());

// Generate CSRF token for forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
```

### Input Validation
```typescript
import { ValidationMiddleware } from '@packages/security/input';
import Joi from 'joi';

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
});

// Apply validation middleware
app.post('/users', 
  ValidationMiddleware.validate({
    body: createUserSchema,
    sanitize: true,
    stripUnknown: true
  }),
  createUserController
);
```

### GDPR Consent Management
```typescript
import { ConsentManager } from '@packages/security/gdpr';

const consentManager = new ConsentManager();

// Record user consent
await consentManager.recordConsent({
  userId: 'user_123',
  purposes: ['analytics', 'marketing', 'essential'],
  lawfulBasis: 'consent',
  consentMethod: 'explicit',
  timestamp: new Date()
});

// Check consent for specific purpose
const hasConsent = await consentManager.hasConsent('user_123', 'analytics');

// Withdraw consent
await consentManager.withdrawConsent({
  userId: 'user_123',
  purposes: ['marketing'],
  reason: 'user_request'
});
```

### Rate Limiting
```typescript
import { RateLimiter } from '@packages/security/rate-limiting';

// API rate limiting
const apiLimiter = RateLimiter.create({
  strategy: 'sliding-window',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Authentication rate limiting
const authLimiter = RateLimiter.create({
  strategy: 'fixed-window',
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 login attempts per minute
  skipSuccessfulRequests: true
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.post('/auth/login', authLimiter, loginController);
```

### Data Encryption
```typescript
import { FieldEncryption } from '@packages/security/encryption';

const encryption = new FieldEncryption({
  algorithm: 'aes-256-gcm',
  keyDerivation: 'pbkdf2',
  iterations: 100000
});

// Encrypt sensitive user data
const encryptedData = await encryption.encryptFields({
  email: 'user@example.com',
  phone: '+1234567890',
  address: '123 Main St, City, State'
}, ['email', 'phone', 'address']);

// Store encrypted data in database
await database.save({
  userId: 'user_123',
  ...encryptedData
});

// Decrypt data when needed
const userData = await database.findById('user_123');
const decryptedData = await encryption.decryptFields(userData, ['email', 'phone', 'address']);
```

## Dependencies
- **Helmet**: ^7.0.0 - HTTP security headers
- **express-rate-limit**: ^6.10.0 - Rate limiting middleware
- **Joi**: ^17.9.0 - Input validation and sanitization
- **bcrypt**: ^5.1.0 - Password hashing
- **argon2**: ^0.31.0 - Advanced password hashing
- **crypto**: Built-in Node.js cryptography module 