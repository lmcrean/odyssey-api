# Apps - Main Applications

> **Domain-driven applications**, each self-contained with specific business purposes

## Structure Overview
```
apps/
├── web/                     # React frontend (creators & fans)
├── api/                     # Express.js backend (core API)
├── payments/               # Payment processing & revenue
├── workers/               # Background job processing
└── admin/                 # Platform administration
```

## Detailed Breakdowns

### Frontend Applications
- **[web.md](./web.md)** - React frontend with creator & fan interfaces
- **[admin.md](./admin.md)** - Platform administration dashboard

### Backend Services
- **[api.md](./api.md)** - Core Express.js API server
- **[payments.md](./payments.md)** - Stripe payment processing
- **[workers.md](./workers.md)** - Background job processing

## Key Principles
- **TypeScript First**: All applications built with TypeScript
- **Domain Separation**: Each app handles specific business domain
- **Vercel Optimized**: Configured for Vercel deployment
- **Test Driven**: Comprehensive test coverage with Vitest & Playwright
- **GDPR Compliant**: Privacy by design across all applications

---

## Quick Reference

### Frontend Applications

## **apps/web/** - React Frontend
> **Main user interface** for creators and fans, built with React + TypeScript + Vite

```typescript
web/
├── package.json            // Dependencies: react, typescript, vite, tailwind
├── vite.config.ts         // Vite configuration
├── vercel.json           // Vercel deployment config
├── playwright.config.ts  // E2E test configuration
├── public/
│   ├── favicon.ico
│   └── manifest.json     // PWA manifest
├── src/
│   ├── main.tsx         // App entry point
│   ├── App.tsx          // Root component
│   ├── components/      // UI components
│   │   ├── creator/     // Creator-specific components
│   │   │   ├── Dashboard.tsx      // Revenue dashboard
│   │   │   ├── ContentUpload.tsx  // Media upload interface
│   │   │   ├── SponsorshipPanel.tsx
│   │   │   └── __tests__/
│   │   ├── fan/         // Fan-specific components  
│   │   │   ├── FeedView.tsx       // Content consumption
│   │   │   ├── SponsorButton.tsx  // Support creators
│   │   │   └── __tests__/
│   │   ├── shared/      // Shared components
│   │   │   ├── Layout.tsx
│   │   │   ├── AuthGuard.tsx
│   │   │   └── __tests__/
│   │   └── ui/          // Design system components
│   ├── pages/           // Route components
│   │   ├── Home.tsx
│   │   ├── Creator/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Earnings.tsx
│   │   ├── Fan/
│   │   │   ├── Feed.tsx
│   │   │   └── Discover.tsx
│   │   └── __tests__/
│   ├── hooks/           // Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCreator.ts
│   │   ├── usePayments.ts
│   │   └── __tests__/
│   ├── services/        // API communication
│   │   ├── api.ts       // HTTP client
│   │   ├── websocket.ts // Real-time updates
│   │   └── __tests__/
│   ├── store/           // State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── creatorStore.ts
│   │   ├── paymentStore.ts
│   │   └── __tests__/
│   └── types/           // TypeScript definitions
│       ├── Creator.ts
│       ├── Content.ts
│       └── Payment.ts
└── e2e/                 // Playwright E2E tests
    ├── creator-flow.spec.ts
    ├── fan-journey.spec.ts
    └── payment-flow.spec.ts
```

**Key Features:**
- Creator dashboard with revenue analytics
- Content upload (photos, videos, live streaming)
- Fan engagement tools (sponsorships, subscriptions)
- Real-time notifications
- GDPR consent management

---

## **apps/api/** - Express.js Backend
> **Core API server** handling all business logic, authentication, and data operations

```typescript
api/
├── package.json           // Dependencies: express, typescript, prisma
├── tsconfig.json
├── vercel.json           // Vercel Functions configuration
├── src/
│   ├── index.ts          // Server entry point
│   ├── app.ts           // Express app configuration
│   ├── routes/          // API endpoints
│   │   ├── auth/        // Authentication routes
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   ├── refresh.ts
│   │   │   └── __tests__/
│   │   ├── creators/    // Creator management
│   │   │   ├── profile.ts
│   │   │   ├── content.ts
│   │   │   ├── analytics.ts
│   │   │   └── __tests__/
│   │   ├── content/     // Content management
│   │   │   ├── upload.ts
│   │   │   ├── moderation.ts
│   │   │   └── __tests__/
│   │   ├── payments/    // Payment endpoints
│   │   │   ├── sponsorship.ts
│   │   │   ├── subscription.ts
│   │   │   └── __tests__/
│   │   └── gdpr/        // GDPR compliance endpoints
│   │       ├── consent.ts
│   │       ├── data-export.ts
│   │       ├── data-deletion.ts
│   │       └── __tests__/
│   ├── controllers/     // Request handlers
│   │   ├── AuthController.ts
│   │   ├── CreatorController.ts
│   │   ├── ContentController.ts
│   │   ├── PaymentController.ts
│   │   └── __tests__/
│   ├── models/         // Database models (Prisma)
│   │   ├── User.ts
│   │   ├── Creator.ts
│   │   ├── Content.ts
│   │   ├── Payment.ts
│   │   └── __tests__/
│   ├── services/       // Business logic
│   │   ├── AuthService.ts
│   │   ├── ContentService.ts
│   │   ├── PaymentService.ts
│   │   ├── GDPRService.ts
│   │   └── __tests__/
│   ├── middleware/     // Request middleware
│   │   ├── auth.ts     // JWT authentication
│   │   ├── validation.ts
│   │   ├── rateLimit.ts
│   │   ├── gdpr.ts     // GDPR compliance
│   │   └── __tests__/
│   ├── database/       // Database configuration
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── connection.ts
│   └── utils/
│       ├── logger.ts
│       ├── errors.ts
│       └── __tests__/
└── prisma/             // Database schema & migrations
    ├── schema.prisma
    ├── migrations/
    └── seed.ts
```

**Key Features:**
- RESTful API with OpenAPI documentation
- JWT-based authentication
- GDPR-compliant data handling
- Content moderation pipeline
- Revenue tracking and reporting

---

## **apps/payments/** - Payment Processing
> **Stripe integration** handling all monetary transactions, revenue sharing, and tax compliance

```typescript
payments/
├── package.json        // Dependencies: stripe, typescript
├── vercel.json        // Vercel Functions for webhooks
├── src/
│   ├── stripe/        // Stripe integration
│   │   ├── client.ts  // Stripe API client
│   │   ├── webhooks.ts // Stripe webhook handlers
│   │   └── __tests__/
│   ├── services/      // Payment business logic
│   │   ├── PaymentService.ts      // Process payments
│   │   ├── SubscriptionService.ts // Handle subscriptions
│   │   ├── PayoutService.ts       // Creator payouts
│   │   ├── TaxService.ts          // Tax calculation & reporting
│   │   └── __tests__/
│   ├── models/        // Payment data models
│   │   ├── Payment.ts
│   │   ├── Subscription.ts
│   │   ├── Payout.ts
│   │   └── __tests__/
│   ├── routes/        // Payment API endpoints
│   │   ├── payment.ts
│   │   ├── subscription.ts
│   │   ├── payout.ts
│   │   ├── tax.ts
│   │   └── __tests__/
│   └── utils/
│       ├── calculations.ts    // Revenue sharing formulas
│       ├── validation.ts     // Payment validation
│       └── __tests__/
└── tax-forms/         // Tax document generation
    ├── 1099-generator.ts     // US tax forms
    ├── eu-vat.ts            // EU VAT handling
    └── __tests__/
```

**Key Features:**
- Stripe Connect for creator payments
- Subscription management
- Revenue sharing calculations
- Tax form generation (1099, EU VAT)
- International payment support

---

## **apps/workers/** - Background Processing
> **Queue-based job processing** for heavy operations like content processing, notifications, and analytics

```typescript
workers/
├── package.json       // Dependencies: bullmq, redis
├── vercel.json       // Vercel cron jobs
├── src/
│   ├── queues/       // Job queue definitions
│   │   ├── contentQueue.ts    // Video processing, image optimization
│   │   ├── notificationQueue.ts // Email, push notifications
│   │   ├── analyticsQueue.ts   // Data aggregation
│   │   └── paymentQueue.ts     // Payment processing
│   ├── jobs/         // Job processors
│   │   ├── content/
│   │   │   ├── VideoProcessor.ts   // Video transcoding
│   │   │   ├── ImageOptimizer.ts   // Image compression
│   │   │   └── __tests__/
│   │   ├── notifications/
│   │   │   ├── EmailSender.ts
│   │   │   ├── PushNotifier.ts
│   │   │   └── __tests__/
│   │   ├── analytics/
│   │   │   ├── ReportsGenerator.ts
│   │   │   ├── MetricsAggregator.ts
│   │   │   └── __tests__/
│   │   └── payments/
│   │       ├── PayoutProcessor.ts
│   │       ├── TaxCalculator.ts
│   │       └── __tests__/
│   ├── services/     // Worker services
│   │   ├── QueueService.ts
│   │   ├── SchedulerService.ts
│   │   └── __tests__/
│   └── utils/
│       ├── redis.ts  // Redis connection
│       └── logger.ts
└── cron/            // Scheduled jobs
    ├── daily-analytics.ts
    ├── monthly-payouts.ts
    └── content-cleanup.ts
```

**Key Features:**
- Redis-based job queues
- Content processing pipeline
- Automated payouts
- Analytics generation
- Notification delivery

---

## **apps/admin/** - Platform Administration
> **Admin dashboard** for platform management, content moderation, and creator support

```typescript
admin/
├── package.json
├── src/
│   ├── components/    // Admin UI components
│   │   ├── Dashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── ContentModeration.tsx
│   │   ├── PaymentAdmin.tsx
│   │   └── __tests__/
│   ├── pages/        // Admin pages
│   │   ├── Overview.tsx
│   │   ├── Creators.tsx
│   │   ├── Content.tsx
│   │   ├── Payments.tsx
│   │   ├── Support.tsx
│   │   └── __tests__/
│   ├── services/     // Admin API calls
│   │   ├── AdminAPI.ts
│   │   └── __tests__/
│   └── types/        // Admin-specific types
│       └── Admin.ts
└── e2e/             // Admin workflow tests
    └── admin-flow.spec.ts
```

**Key Features:**
- Creator onboarding management
- Content moderation tools
- Payment dispute resolution
- Platform analytics
- GDPR compliance monitoring 