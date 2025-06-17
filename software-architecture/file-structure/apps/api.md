# apps/api - Express.js Backend

> **Core API server** handling all business logic, authentication, and data operations

## Overview
The API serves as the central backend for the creator platform, handling authentication, content management, payments, and all business logic with GDPR compliance.

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
│   │   │   │   ├── verify.ts      // GET /auth/verify
│   │   │   │   └── __tests__/
│   │   │   ├── users/             // User management routes
│   │   │   │   ├── index.ts       // User route exports
│   │   │   │   ├── profile.ts     // GET/PUT /users/profile
│   │   │   │   ├── search.ts      // GET /users/search
│   │   │   │   ├── follow.ts      // POST /users/:id/follow
│   │   │   │   └── __tests__/
│   │   │   ├── creators/          // Creator-specific routes
│   │   │   │   ├── index.ts       // Creator route exports
│   │   │   │   ├── profile.ts     // GET/PUT /creators/profile
│   │   │   │   ├── analytics.ts   // GET /creators/analytics
│   │   │   │   ├── earnings.ts    // GET /creators/earnings
│   │   │   │   ├── dashboard.ts   // GET /creators/dashboard
│   │   │   │   └── __tests__/
│   │   │   ├── content/           // Content management routes
│   │   │   │   ├── index.ts       // Content route exports
│   │   │   │   ├── upload.ts      // POST /content/upload
│   │   │   │   ├── feed.ts        // GET /content/feed
│   │   │   │   ├── discover.ts    // GET /content/discover
│   │   │   │   ├── search.ts      // GET /content/search
│   │   │   │   ├── moderate.ts    // POST /content/:id/moderate
│   │   │   │   ├── like.ts        // POST /content/:id/like
│   │   │   │   ├── comment.ts     // POST /content/:id/comment
│   │   │   │   └── __tests__/
│   │   │   ├── payments/          // Payment routes
│   │   │   │   ├── index.ts       // Payment route exports
│   │   │   │   ├── sponsor.ts     // POST /payments/sponsor
│   │   │   │   ├── subscribe.ts   // POST /payments/subscribe
│   │   │   │   ├── history.ts     // GET /payments/history
│   │   │   │   ├── methods.ts     // GET/POST /payments/methods
│   │   │   │   └── __tests__/
│   │   │   ├── live/              // Live streaming routes
│   │   │   │   ├── index.ts       // Live route exports
│   │   │   │   ├── stream.ts      // POST /live/stream
│   │   │   │   ├── chat.ts        // WebSocket /live/chat
│   │   │   │   └── __tests__/
│   │   │   └── gdpr/              // GDPR compliance routes
│   │   │       ├── index.ts       // GDPR route exports
│   │   │       ├── consent.ts     // POST /gdpr/consent
│   │   │       ├── export.ts      // GET /gdpr/export
│   │   │       ├── delete.ts      // DELETE /gdpr/delete
│   │   │       ├── rectify.ts     // PUT /gdpr/rectify
│   │   │       └── __tests__/
│   │   └── webhooks/              // External service webhooks
│   │       ├── stripe.ts          // Stripe webhook handler
│   │       ├── cloudinary.ts      // Cloudinary webhook handler
│   │       └── __tests__/
│   ├── controllers/     // Request handlers
│   │   ├── AuthController.ts      // Authentication logic
│   │   ├── UserController.ts      // User management logic
│   │   ├── CreatorController.ts   // Creator operations logic
│   │   ├── ContentController.ts   // Content management logic
│   │   ├── PaymentController.ts   // Payment processing logic
│   │   ├── LiveController.ts      // Live streaming logic
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
│   │   │   ├── FollowService.ts   // Follow/unfollow logic
│   │   │   └── __tests__/
│   │   ├── creator/
│   │   │   ├── CreatorService.ts  // Creator business logic
│   │   │   ├── AnalyticsService.ts // Creator analytics
│   │   │   ├── EarningsService.ts  // Earnings calculations
│   │   │   └── __tests__/
│   │   ├── content/
│   │   │   ├── ContentService.ts   // Content management logic
│   │   │   ├── FeedService.ts     // Feed algorithm
│   │   │   ├── SearchService.ts   // Content search logic
│   │   │   ├── ModerationService.ts // Content moderation
│   │   │   └── __tests__/
│   │   ├── payment/
│   │   │   ├── PaymentService.ts   // Payment processing logic
│   │   │   ├── StripeService.ts   // Stripe integration
│   │   │   ├── PayoutService.ts   // Creator payouts
│   │   │   └── __tests__/
│   │   ├── live/
│   │   │   ├── LiveStreamService.ts // Live streaming logic
│   │   │   ├── ChatService.ts     // Live chat management
│   │   │   └── __tests__/
│   │   ├── gdpr/
│   │   │   ├── GDPRService.ts     // GDPR compliance logic
│   │   │   ├── ConsentService.ts  // Consent management
│   │   │   ├── DataExportService.ts // Data export logic
│   │   │   ├── DataDeletionService.ts // Data deletion logic
│   │   │   └── __tests__/
│   │   └── shared/
│   │       ├── EmailService.ts    // Email notifications
│   │       ├── NotificationService.ts // Push notifications
│   │       ├── StorageService.ts  // File storage logic
│   │       └── __tests__/
│   ├── models/          // Database models (Prisma)
│   │   ├── User.ts               // User model definitions
│   │   ├── Creator.ts            // Creator model definitions
│   │   ├── Content.ts            // Content model definitions
│   │   ├── Payment.ts            // Payment model definitions
│   │   ├── Subscription.ts       // Subscription model definitions
│   │   ├── LiveStream.ts         // Live stream model definitions
│   │   ├── GDPRConsent.ts        // GDPR consent model
│   │   └── __tests__/
│   ├── middleware/      // Express middleware
│   │   ├── auth/
│   │   │   ├── authenticate.ts    // JWT authentication
│   │   │   ├── authorize.ts       // Role-based authorization
│   │   │   ├── rateLimit.ts       // Authentication rate limiting
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
│   │   │   ├── rateLimiting.ts   // API rate limiting
│   │   │   ├── sanitization.ts   // Input sanitization
│   │   │   └── __tests__/
│   │   ├── gdpr/
│   │   │   ├── gdprCompliance.ts // GDPR middleware
│   │   │   ├── consentCheck.ts   // Consent validation
│   │   │   ├── dataPurpose.ts    // Data processing purpose
│   │   │   └── __tests__/
│   │   ├── logging/
│   │   │   ├── requestLogger.ts  // Request logging
│   │   │   ├── errorLogger.ts    // Error logging
│   │   │   ├── auditLogger.ts    // Audit trail logging
│   │   │   └── __tests__/
│   │   └── upload/
│   │       ├── multer.ts         // File upload handling
│   │       ├── fileValidation.ts // File validation
│   │       ├── virusScanning.ts  // File security scanning
│   │       └── __tests__/
│   ├── database/        // Database configuration
│   │   ├── prisma/
│   │   │   ├── schema.prisma     // Database schema
│   │   │   ├── migrations/       // Database migrations
│   │   │   └── seed.ts          // Database seeding
│   │   ├── connection.ts         // Database connection
│   │   ├── transactions.ts       // Database transactions
│   │   └── __tests__/
│   ├── websocket/       // WebSocket handling
│   │   ├── index.ts             // WebSocket server setup
│   │   ├── handlers/
│   │   │   ├── liveChat.ts      // Live chat handling
│   │   │   ├── notifications.ts  // Real-time notifications
│   │   │   ├── liveStream.ts    // Live stream events
│   │   │   └── __tests__/
│   │   ├── middleware/
│   │   │   ├── wsAuth.ts        // WebSocket authentication
│   │   │   ├── wsRateLimit.ts   // WebSocket rate limiting
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── roomManager.ts   // Room management
│   │       ├── messageQueue.ts  // Message queuing
│   │       └── __tests__/
│   ├── jobs/            // Background job definitions
│   │   ├── content/
│   │   │   ├── processVideo.ts   // Video processing job
│   │   │   ├── generateThumbnails.ts // Thumbnail generation
│   │   │   ├── moderateContent.ts // Content moderation job
│   │   │   └── __tests__/
│   │   ├── payments/
│   │   │   ├── processPayouts.ts // Creator payout processing
│   │   │   ├── calculateEarnings.ts // Earnings calculation
│   │   │   └── __tests__/
│   │   ├── notifications/
│   │   │   ├── sendEmails.ts     // Email sending job
│   │   │   ├── pushNotifications.ts // Push notification job
│   │   │   └── __tests__/
│   │   └── analytics/
│   │       ├── aggregateMetrics.ts // Metrics aggregation job
│   │       ├── generateReports.ts  // Report generation job
│   │       └── __tests__/
│   └── utils/           // Utility functions
│       ├── logger.ts            // Winston logger configuration
│       ├── errors.ts            // Custom error classes
│       ├── validation.ts        // Validation utilities
│       ├── encryption.ts        // Encryption utilities
│       ├── dateHelpers.ts       // Date manipulation utilities
│       ├── constants.ts         // Application constants
│       └── __tests__/
├── prisma/              // Prisma configuration
│   ├── schema.prisma    // Database schema definition
│   ├── migrations/      // Database migration files
│   ├── seed.ts         // Database seeding script
│   └── dbml/           // Database documentation
└── docs/               // API documentation
    ├── openapi.yaml    // OpenAPI specification
    ├── endpoints.md    // Endpoint documentation
    └── authentication.md // Auth documentation
```

## Key Features

### Authentication & Authorization
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (Creator, Fan, Admin)
- **OAuth integration** (Google, GitHub, Twitter)
- **Multi-factor authentication** support
- **Session management** with Redis

### Content Management
- **Multi-format upload** (photos, videos, audio, live streams)
- **Content moderation** with AI-powered scanning
- **Search and discovery** with advanced filtering
- **Real-time feed** with personalized algorithms
- **Content analytics** and performance tracking

### Payment Processing
- **Stripe integration** for payment processing
- **Creator payouts** with automated scheduling
- **Subscription management** with recurring billing
- **Sponsorship handling** with one-time payments
- **Revenue analytics** with detailed reporting

### GDPR Compliance
- **Consent management** with granular controls
- **Data export** in machine-readable formats
- **Data deletion** with cascading cleanup
- **Processing records** for audit trails
- **Cookie consent** management

### Real-time Features
- **WebSocket support** for live updates
- **Live streaming** with RTMP integration
- **Live chat** with moderation tools
- **Real-time notifications** for all user types
- **Presence tracking** for online status

## Database Schema (Prisma)
```prisma
// Key models in prisma/schema.prisma
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
  subscriptions Subscription[]
  analytics    Analytics[]
  earnings     Earnings[]
}

model Content {
  id          String      @id @default(cuid())
  creatorId   String
  creator     Creator     @relation(fields: [creatorId], references: [id])
  type        ContentType
  url         String
  metadata    Json
  analytics   ContentAnalytics[]
  moderation  ModerationRecord?
}

model Payment {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  stripePaymentId String        @unique
  amount          Decimal
  currency        String
  type            PaymentType
  status          PaymentStatus
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
REDIS_URL="redis://localhost:6379"
MIXPANEL_TOKEN="your-mixpanel-token"
```

## API Endpoints
```typescript
// Authentication
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/verify

// Users
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
GET    /api/v1/users/search
POST   /api/v1/users/:id/follow

// Creators
GET    /api/v1/creators/profile
PUT    /api/v1/creators/profile
GET    /api/v1/creators/analytics
GET    /api/v1/creators/earnings
GET    /api/v1/creators/dashboard

// Content
POST   /api/v1/content/upload
GET    /api/v1/content/feed
GET    /api/v1/content/discover
GET    /api/v1/content/search
POST   /api/v1/content/:id/like
POST   /api/v1/content/:id/comment

// Payments
POST   /api/v1/payments/sponsor
POST   /api/v1/payments/subscribe
GET    /api/v1/payments/history
GET    /api/v1/payments/methods

// GDPR
POST   /api/v1/gdpr/consent
GET    /api/v1/gdpr/export
DELETE /api/v1/gdpr/delete
PUT    /api/v1/gdpr/rectify
```

## Deployment
- **Vercel Functions**: Serverless API deployment
- **PostgreSQL**: Neon database for production
- **Redis**: Upstash for session storage and caching
- **Monitoring**: Comprehensive logging and error tracking 