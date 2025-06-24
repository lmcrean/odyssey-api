# apps/api - Express.js Backend 

> **Core API server** handling essential business logic, authentication, and data operations for MVP launch

## Overview
The API serves as the central backend for the creator platform MVP, handling basic authentication, simple content management, and essential payment processing for 100-500 creators.

## Tech Stack 
- **Express.js** with TypeScript
- **Prisma** ORM with PostgreSQL
- **JWT** for authentication
- **Zod** for validation
- **Winston** for logging
- **Vitest** for unit testing

## File Structure 
```typescript
api/
├── package.json           // Dependencies: express, prisma, typescript
├── tsconfig.json         // TypeScript configuration
├── vercel.json          // Vercel Functions configuration
├── vitest.config.ts     // Unit test configuration
├── src/
│   ├── index.ts         // Server entry point
│   ├── app.ts          // Express app configuration
│   ├── routes/         // API route definitions
│   │   ├── v1/         // API version 1
│   │   │   ├── index.ts           // Route aggregation
│   │   │   ├── auth/              // Authentication routes 
│   │   │   │   ├── index.ts       // Auth route exports
│   │   │   │   ├── login.ts       // POST /auth/login
│   │   │   │   ├── register.ts    // POST /auth/register
│   │   │   │   ├── refresh.ts     // POST /auth/refresh
│   │   │   │   ├── logout.ts      // POST /auth/logout
│   │   │   │   └── __tests__/
│   │   │   ├── users/             // User management routes 
│   │   │   │   ├── index.ts       // User route exports
│   │   │   │   ├── profile.ts     // GET/PUT /users/profile
│   │   │   │   ├── search.ts      // GET /users/search (basic)
│   │   │   │   └── __tests__/
│   │   │   ├── creators/          // Creator-specific routes 
│   │   │   │   ├── index.ts       // Creator route exports
│   │   │   │   ├── profile.ts     // GET/PUT /creators/profile
│   │   │   │   └── __tests__/
│   │   │   ├── content/           // Content management routes 
│   │   │   │   ├── index.ts       // Content route exports
│   │   │   │   ├── upload.ts      // POST /content/upload (images only)
│   │   │   │   ├── feed.ts        // GET /content/feed (basic)
│   │   │   │   ├── like.ts        // POST /content/:id/like
│   │   │   │   └── __tests__/
│   │   │   ├── payments/          // Payment routes 
│   │   │   │   ├── index.ts       // Payment route exports
│   │   │   │   ├── sponsor.ts     // POST /payments/sponsor (one-time)
│   │   │   │   ├── history.ts     // GET /payments/history (basic)
│   │   │   │   └── __tests__/
│   │   │   └── gdpr/              // Basic GDPR compliance 
│   │   │       ├── index.ts       // GDPR route exports
│   │   │       ├── consent.ts     // POST /gdpr/consent (basic)
│   │   │       ├── export.ts      // GET /gdpr/export (basic)
│   │   │       └── __tests__/
│   │   └── webhooks/              // Essential webhooks 
│   │       ├── stripe.ts          // Stripe webhook handler
│   │       └── __tests__/
│   ├── controllers/     // Request handlers 
│   │   ├── AuthController.ts      // Authentication logic
│   │   ├── UserController.ts      // User management logic
│   │   ├── CreatorController.ts   // Creator operations logic
│   │   ├── ContentController.ts   // Content management logic
│   │   ├── PaymentController.ts   // Payment processing logic
│   │   ├── GDPRController.ts      // GDPR compliance logic
│   │   └── __tests__/
│   ├── services/        // Business logic services 
│   │   ├── auth/
│   │   │   ├── AuthService.ts     // Authentication business logic
│   │   │   ├── TokenService.ts    // JWT token management
│   │   │   ├── PasswordService.ts // Password hashing/validation
│   │   │   └── __tests__/
│   │   ├── user/
│   │   │   ├── UserService.ts     // User management logic
│   │   │   ├── ProfileService.ts  // Profile management
│   │   │   └── __tests__/
│   │   ├── creator/
│   │   │   ├── CreatorService.ts  // Creator business logic
│   │   │   └── __tests__/
│   │   ├── content/
│   │   │   ├── ContentService.ts   // Content management logic
│   │   │   ├── FeedService.ts     // Basic feed logic
│   │   │   └── __tests__/
│   │   ├── payment/
│   │   │   ├── PaymentService.ts   // Payment processing logic
│   │   │   ├── StripeService.ts   // Stripe integration
│   │   │   └── __tests__/
│   │   ├── gdpr/
│   │   │   ├── GDPRService.ts     // Basic GDPR compliance
│   │   │   ├── ConsentService.ts  // Consent management
│   │   │   └── __tests__/
│   │   └── shared/
│   │       ├── EmailService.ts    // Basic email notifications
│   │       ├── StorageService.ts  // File storage logic
│   │       └── __tests__/
│   ├── models/          // Database models (Prisma) 
│   │   ├── User.ts               // User model definitions
│   │   ├── Creator.ts            // Creator model definitions
│   │   ├── Content.ts            // Content model definitions
│   │   ├── Payment.ts            // Payment model definitions
│   │   ├── GDPRConsent.ts        // GDPR consent model
│   │   └── __tests__/
│   ├── middleware/      // Express middleware 
│   │   ├── auth/
│   │   │   ├── authenticate.ts    // JWT authentication
│   │   │   ├── authorize.ts       // Basic role authorization
│   │   │   └── __tests__/
│   │   ├── validation/
│   │   │   ├── validateRequest.ts // Request validation middleware
│   │   │   ├── schemas/          // Zod validation schemas
│   │   │   │   ├── authSchemas.ts
│   │   │   │   ├── userSchemas.ts
│   │   │   │   ├── contentSchemas.ts
│   │   │   │   └── paymentSchemas.ts
│   │   │   └── __tests__/
│   │   ├── security/
│   │   │   ├── cors.ts           // CORS configuration
│   │   │   ├── helmet.ts         // Security headers
│   │   │   ├── rateLimiting.ts   // Basic API rate limiting
│   │   │   └── __tests__/
│   │   ├── gdpr/
│   │   │   ├── gdprCompliance.ts // Basic GDPR middleware
│   │   │   └── __tests__/
│   │   ├── logging/
│   │   │   ├── requestLogger.ts  // Request logging
│   │   │   ├── errorLogger.ts    // Error logging
│   │   │   └── __tests__/
│   │   └── upload/
│   │       ├── multer.ts         // File upload handling
│   │       ├── fileValidation.ts // Basic file validation
│   │       └── __tests__/
│   ├── database/        // Database configuration 
│   │   ├── prisma/
│   │   │   ├── schema.prisma     // Database schema
│   │   │   ├── migrations/       // Database migrations
│   │   │   └── seed.ts          // Database seeding
│   │   ├── connection.ts         // Database connection
│   │   └── __tests__/
│   └── utils/           // Utility functions 
│       ├── logger.ts            // Winston logger configuration
│       ├── errors.ts            // Custom error classes
│       ├── validation.ts        // Validation utilities
│       ├── encryption.ts        // Encryption utilities
│       ├── constants.ts         // Application constants
│       └── __tests__/
├── prisma/              // Prisma configuration 
│   ├── schema.prisma    // Database schema definition
│   ├── migrations/      // Database migration files
│   └── seed.ts         // Database seeding script
└── docs/               // API documentation 
    ├── openapi.yaml    // OpenAPI specification
    └── endpoints.md    // Endpoint documentation
```

## Key Features

### Authentication & Authorization 
- **JWT-based authentication** with refresh tokens
- **Basic role-based access control** (Creator, Fan)
- **Password reset** functionality

### Content Management 
- **Image upload** (photos only for MVP)
- **Basic content feed** with chronological ordering
- **Content likes** and basic interactions
- **Simple content search** by title/description

### Payment Processing 
- **Stripe integration** for payment processing
- **One-time sponsorship** payments
- **Basic payment history** tracking

### GDPR Compliance 
- **Basic consent management**
- **Simple data export** functionality
- **Basic privacy policy** compliance

### User Management 
- **User registration** and profile management
- **Creator profile** setup and management
- **Basic user search** functionality

## Database Schema (Prisma) 
```prisma
// Essential models for MVP
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  profile     Profile?
  creator     Creator?
  payments    Payment[]
  gdprConsent GDPRConsent[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Creator {
  id           String        @id @default(cuid())
  userId       String        @unique
  user         User          @relation(fields: [userId], references: [id])
  content      Content[]
  payments     Payment[]     @relation("CreatorPayments")
}

model Content {
  id          String      @id @default(cuid())
  creatorId   String
  creator     Creator     @relation(fields: [creatorId], references: [id])
  type        ContentType // IMAGE only for MVP
  url         String
  title       String
  description String?
  likes       Like[]
  createdAt   DateTime    @default(now())
}

model Payment {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  creatorId       String
  creator         Creator       @relation("CreatorPayments", fields: [creatorId], references: [id])
  stripePaymentId String        @unique
  amount          Decimal
  currency        String
  type            PaymentType   // SPONSOR only for MVP
  status          PaymentStatus
  createdAt       DateTime      @default(now())
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  contentId String
  content   Content  @relation(fields: [contentId], references: [id])
  createdAt DateTime @default(now())
  
  @@unique([userId, contentId])
}

model GDPRConsent {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  consented Boolean
  createdAt DateTime @default(now())
}

enum ContentType {
  IMAGE
}

enum PaymentType {
  SPONSOR
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
}
```

## Environment Configuration 
```typescript
// .env
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## API Endpoints 
```typescript
// Authentication
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

// Users
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
GET    /api/v1/users/search

// Creators
GET    /api/v1/creators/profile
PUT    /api/v1/creators/profile

// Content
POST   /api/v1/content/upload
GET    /api/v1/content/feed
POST   /api/v1/content/:id/like
DELETE /api/v1/content/:id/like

// Payments
POST   /api/v1/payments/sponsor
GET    /api/v1/payments/history

// GDPR
POST   /api/v1/gdpr/consent
GET    /api/v1/gdpr/export
```

## Deployment 
- **Vercel Functions**: Serverless API deployment
- **PostgreSQL**: Neon database for production
- **Basic monitoring**: Error logging and health checks

## MVP Limitations 🔄
- **Content**: Images only (no video, audio, or live streaming)
- **Payments**: One-time sponsorships only (no subscriptions)
- **Search**: Basic text search only
- **Analytics**: Minimal tracking
- **Social Features**: Basic likes only (no comments, follows, or messaging)
- **Notifications**: Email only (no push notifications) 