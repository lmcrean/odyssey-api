# Packages - Shared Libraries

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

---

## **packages/shared/** - Core Utilities
> **Foundation types and utilities** used across all applications

```typescript
shared/
├── package.json        // Core dependencies: zod, date-fns, lodash
├── src/
│   ├── types/         // Global TypeScript definitions
│   │   ├── User.ts              // Base user types
│   │   ├── Creator.ts           // Creator-specific types
│   │   ├── Content.ts           // Content types (photo, video, etc.)
│   │   ├── Payment.ts           // Payment & revenue types
│   │   ├── GDPR.ts             // GDPR compliance types
│   │   ├── API.ts              // API response types
│   │   ├── index.ts            // Type exports
│   │   └── __tests__/
│   ├── validation/    // Zod schemas
│   │   ├── userSchemas.ts       // User validation
│   │   ├── creatorSchemas.ts    // Creator validation
│   │   ├── contentSchemas.ts    // Content validation
│   │   ├── paymentSchemas.ts    // Payment validation
│   │   ├── gdprSchemas.ts       // GDPR validation
│   │   ├── index.ts
│   │   └── __tests__/
│   ├── constants/     // App-wide constants
│   │   ├── errors.ts            // Error messages & codes
│   │   ├── limits.ts            // File size, rate limits
│   │   ├── currencies.ts        // Supported currencies
│   │   ├── regions.ts           // GDPR regions & compliance
│   │   ├── contentTypes.ts      // Supported media types
│   │   ├── index.ts
│   │   └── __tests__/
│   └── utils/         // Utility functions
│       ├── formatters.ts        // Date, currency formatting
│       ├── validators.ts        // Email, URL validation
│       ├── sanitizers.ts        // HTML sanitization
│       ├── crypto.ts           // Hashing, encryption
│       ├── gdpr.ts             // GDPR utilities
│       ├── index.ts
│       └── __tests__/
└── docs/              // Package documentation
    └── README.md
```

**Key Features:**
- Zod-based validation schemas
- TypeScript-first type definitions
- GDPR compliance utilities
- Internationalization support

---

## **packages/auth/** - Authentication
> **JWT-based authentication** with OAuth support and session management

```typescript
auth/
├── package.json       // Dependencies: jsonwebtoken, bcrypt, oauth2
├── src/
│   ├── client/       // Frontend auth utilities
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           // Authentication hook
│   │   │   ├── useSession.ts        // Session management
│   │   │   ├── useOAuth.ts          // OAuth providers
│   │   │   └── __tests__/
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      // React auth context
│   │   │   ├── SessionProvider.tsx  // Session provider
│   │   │   └── __tests__/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx        // Login component
│   │   │   ├── SignupForm.tsx       // Registration component
│   │   │   ├── OAuthButtons.tsx     // OAuth login buttons
│   │   │   ├── GDPRConsent.tsx     // GDPR consent form
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── storage.ts           // Token storage
│   │       ├── api.ts              // Auth API calls
│   │       └── __tests__/
│   ├── server/       // Backend auth utilities
│   │   ├── middleware/
│   │   │   ├── authenticate.ts      // JWT verification
│   │   │   ├── authorize.ts        // Role-based access
│   │   │   ├── rateLimit.ts        // Auth rate limiting
│   │   │   ├── gdprAuth.ts         // GDPR auth checks
│   │   │   └── __tests__/
│   │   ├── services/
│   │   │   ├── TokenService.ts      // JWT generation/validation
│   │   │   ├── PasswordService.ts   // Password hashing
│   │   │   ├── OAuthService.ts      // OAuth integration
│   │   │   ├── SessionService.ts    // Session management
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── jwt.ts              // JWT utilities
│   │       ├── crypto.ts           // Cryptographic functions
│   │       ├── oauth.ts            // OAuth helpers
│   │       └── __tests__/
│   ├── types/        // Auth-specific types
│   │   ├── AuthUser.ts             // Authenticated user
│   │   ├── Session.ts              // Session data
│   │   ├── OAuth.ts               // OAuth providers
│   │   ├── Permissions.ts          // Role permissions
│   │   └── index.ts
│   └── validation/   // Auth validation schemas
│       ├── loginSchema.ts          // Login validation
│       ├── signupSchema.ts         // Registration validation
│       ├── passwordSchema.ts       // Password requirements
│       ├── gdprSchema.ts          // GDPR consent validation
│       ├── index.ts
│       └── __tests__/
└── docs/
    └── README.md
```

**Key Features:**
- JWT-based authentication
- OAuth providers (Google, GitHub, Twitter)
- Role-based authorization
- GDPR consent management
- Session management

---

## **packages/ui/** - Design System
> **Reusable UI components** with consistent styling and accessibility

```typescript
ui/
├── package.json       // Dependencies: react, tailwind, headless-ui
├── tailwind.config.js // Tailwind configuration
├── src/
│   ├── components/   // UI components
│   │   ├── forms/
│   │   │   ├── Input.tsx            // Text input
│   │   │   ├── TextArea.tsx         // Multi-line input
│   │   │   ├── Select.tsx           // Dropdown select
│   │   │   ├── Checkbox.tsx         // Checkbox input
│   │   │   ├── RadioGroup.tsx       // Radio buttons
│   │   │   ├── FileUpload.tsx       // File upload
│   │   │   ├── GDPRConsent.tsx     // GDPR consent checkbox
│   │   │   └── __tests__/
│   │   ├── layout/
│   │   │   ├── Container.tsx        // Page container
│   │   │   ├── Grid.tsx            // CSS Grid wrapper
│   │   │   ├── Stack.tsx           // Vertical/horizontal stack
│   │   │   ├── Sidebar.tsx         // Navigation sidebar
│   │   │   ├── Header.tsx          // Page header
│   │   │   └── __tests__/
│   │   ├── feedback/
│   │   │   ├── Alert.tsx           // Alert messages
│   │   │   ├── Toast.tsx           // Toast notifications
│   │   │   ├── Loading.tsx         // Loading states
│   │   │   ├── Skeleton.tsx        // Content placeholders
│   │   │   ├── ProgressBar.tsx     // Progress indicators
│   │   │   └── __tests__/
│   │   ├── content/
│   │   │   ├── Card.tsx            // Content cards
│   │   │   ├── Avatar.tsx          // User avatars
│   │   │   ├── Badge.tsx           // Status badges
│   │   │   ├── MediaPlayer.tsx     // Video/audio player
│   │   │   ├── ImageGallery.tsx    // Image carousel
│   │   │   └── __tests__/
│   │   ├── navigation/
│   │   │   ├── Button.tsx          // Primary buttons
│   │   │   ├── IconButton.tsx      // Icon-only buttons
│   │   │   ├── Link.tsx            // Styled links
│   │   │   ├── Breadcrumb.tsx      // Navigation breadcrumbs
│   │   │   ├── Tabs.tsx            // Tab navigation
│   │   │   └── __tests__/
│   │   └── overlay/
│   │       ├── Modal.tsx           // Modal dialogs
│   │       ├── Dropdown.tsx        // Dropdown menus
│   │       ├── Tooltip.tsx         // Hover tooltips
│   │       ├── Popover.tsx         // Click popovers
│   │       └── __tests__/
│   ├── hooks/        // UI hooks
│   │   ├── useDisclosure.ts        // Modal/dropdown state
│   │   ├── useToast.ts            // Toast notifications
│   │   ├── useMedia.ts            // Media queries
│   │   ├── useKeyboard.ts         // Keyboard shortcuts
│   │   └── __tests__/
│   ├── styles/       // Styling utilities
│   │   ├── globals.css            // Global styles
│   │   ├── components.css         // Component styles
│   │   ├── variables.css          // CSS variables
│   │   └── animations.css         // Animation keyframes
│   ├── icons/        // Icon components
│   │   ├── social/
│   │   │   ├── Heart.tsx          // Like icon
│   │   │   ├── Share.tsx          // Share icon
│   │   │   ├── Comment.tsx        // Comment icon
│   │   │   └── Follow.tsx         // Follow icon
│   │   ├── actions/
│   │   │   ├── Upload.tsx         // Upload icon
│   │   │   ├── Download.tsx       // Download icon
│   │   │   ├── Edit.tsx           // Edit icon
│   │   │   └── Delete.tsx         // Delete icon
│   │   ├── navigation/
│   │   │   ├── Menu.tsx           // Hamburger menu
│   │   │   ├── Close.tsx          // Close/X icon
│   │   │   ├── ChevronDown.tsx    // Dropdown arrow
│   │   │   └── ArrowBack.tsx      // Back arrow
│   │   └── __tests__/
│   ├── themes/       // Theme definitions
│   │   ├── light.ts              // Light theme
│   │   ├── dark.ts               // Dark theme
│   │   ├── creator.ts            // Creator-focused theme
│   │   └── index.ts
│   └── utils/        // UI utilities
│       ├── classNames.ts         // CSS class utilities
│       ├── responsive.ts         // Responsive helpers
│       ├── accessibility.ts      // A11y utilities
│       └── __tests__/
└── storybook/        // Component documentation
    ├── .storybook/
    └── stories/
```

**Key Features:**
- Tailwind CSS based
- Fully accessible components
- Dark/light mode support
- Mobile-responsive design
- Storybook documentation

---

## **packages/media/** - Content Processing
> **Media handling** for photos, videos, live streams, and file storage

```typescript
media/
├── package.json       // Dependencies: sharp, ffmpeg, cloudinary
├── src/
│   ├── image/        // Image processing
│   │   ├── compress.ts            // Image compression
│   │   ├── resize.ts              // Image resizing
│   │   ├── optimize.ts            // Format optimization
│   │   ├── watermark.ts           // Creator watermarks
│   │   ├── filters.ts             // Image filters
│   │   └── __tests__/
│   ├── video/        // Video processing
│   │   ├── compress.ts            // Video compression
│   │   ├── transcode.ts           // Format conversion
│   │   ├── thumbnail.ts           // Video thumbnails
│   │   ├── streaming.ts           // HLS/DASH streaming
│   │   ├── watermark.ts           // Video watermarks
│   │   └── __tests__/
│   ├── audio/        // Audio processing
│   │   ├── compress.ts            // Audio compression
│   │   ├── transcode.ts           // Format conversion
│   │   ├── waveform.ts            // Waveform generation
│   │   └── __tests__/
│   ├── live/         // Live streaming
│   │   ├── rtmp.ts               // RTMP server integration
│   │   ├── webrtc.ts             // WebRTC streaming
│   │   ├── chat.ts               // Live chat
│   │   └── __tests__/
│   ├── storage/      // File storage
│   │   ├── cloudinary.ts         // Cloudinary integration
│   │   ├── s3.ts                 // AWS S3 integration
│   │   ├── cdn.ts                // CDN distribution
│   │   ├── gdprStorage.ts        // GDPR-compliant storage
│   │   └── __tests__/
│   ├── moderation/   // Content moderation
│   │   ├── aiModeration.ts       // AI content scanning
│   │   ├── imageModeration.ts    // Image content checks
│   │   ├── videoModeration.ts    // Video content checks
│   │   ├── textModeration.ts     // Text content filtering
│   │   └── __tests__/
│   ├── analytics/    // Media analytics
│   │   ├── viewTracking.ts       // View analytics
│   │   ├── engagementMetrics.ts  // Engagement tracking
│   │   ├── performanceMetrics.ts // Load performance
│   │   └── __tests__/
│   └── utils/        // Media utilities
│       ├── metadata.ts           // File metadata extraction
│       ├── validation.ts         // File validation
│       ├── formats.ts            // Format detection
│       └── __tests__/
└── docs/
    └── README.md
```

**Key Features:**
- Multi-format media processing
- Live streaming support
- AI-powered content moderation
- CDN integration
- GDPR-compliant storage

---

## **packages/observability/** - Monitoring & Analytics
> **Comprehensive monitoring** with logging, metrics, and creator analytics

```typescript
observability/
├── package.json       // Dependencies: winston, prometheus, mixpanel
├── src/
│   ├── logging/      // Structured logging
│   │   ├── winston.ts             // Winston configuration
│   │   ├── structuredLogs.ts      // Log formatting
│   │   ├── gdprLogs.ts           // GDPR-compliant logging
│   │   ├── errorTracking.ts       // Error monitoring
│   │   └── __tests__/
│   ├── metrics/      // Application metrics
│   │   ├── prometheus.ts          // Prometheus metrics
│   │   ├── customMetrics.ts       // Business metrics
│   │   ├── performanceMetrics.ts  // Performance tracking
│   │   ├── revenueMetrics.ts      // Revenue analytics
│   │   └── __tests__/
│   ├── tracing/      // Distributed tracing
│   │   ├── opentelemetry.ts       // OpenTelemetry setup
│   │   ├── requestTracing.ts      // HTTP request tracing
│   │   ├── databaseTracing.ts     // Database query tracing
│   │   └── __tests__/
│   ├── analytics/    // Business analytics
│   │   ├── creatorAnalytics.ts    // Creator performance
│   │   ├── contentAnalytics.ts    // Content performance
│   │   ├── revenueAnalytics.ts    // Revenue tracking
│   │   ├── userBehavior.ts        // User behavior tracking
│   │   ├── gdprAnalytics.ts       // GDPR-compliant analytics
│   │   └── __tests__/
│   ├── alerts/       // Alerting system
│   │   ├── errorAlerts.ts         // Error notifications
│   │   ├── performanceAlerts.ts   // Performance alerts
│   │   ├── revenueAlerts.ts       // Revenue anomalies
│   │   └── __tests__/
│   └── dashboards/   // Monitoring dashboards
│       ├── grafana/              // Grafana dashboard configs
│       ├── datadog/              // Datadog dashboard configs
│       └── custom/               // Custom dashboard components
└── docs/
    └── README.md
```

**Key Features:**
- Structured logging with Winston
- Prometheus metrics collection
- OpenTelemetry distributed tracing
- Creator-focused analytics
- GDPR-compliant data collection

---

## **packages/security/** - Security & GDPR
> **Security utilities** and GDPR compliance tools

```typescript
security/
├── package.json       // Dependencies: helmet, express-rate-limit, crypto
├── src/
│   ├── auth/         // Authentication security
│   │   ├── csrf.ts               // CSRF protection
│   │   ├── sessionSecurity.ts    // Session security
│   │   ├── passwordSecurity.ts   // Password policies
│   │   ├── mfa.ts                // Multi-factor authentication
│   │   └── __tests__/
│   ├── input/        // Input validation & sanitization
│   │   ├── validation.ts         // Input validation
│   │   ├── sanitization.ts       // HTML/SQL sanitization
│   │   ├── fileValidation.ts     // File upload security
│   │   └── __tests__/
│   ├── gdpr/         // GDPR compliance
│   │   ├── consent.ts            // Consent management
│   │   ├── dataExport.ts         // Data portability
│   │   ├── dataDeletion.ts       // Right to erasure
│   │   ├── dataProcessing.ts     // Processing records
│   │   ├── cookieConsent.ts      // Cookie consent
│   │   └── __tests__/
│   ├── rateLimit/    // Rate limiting
│   │   ├── apiLimits.ts          // API rate limits
│   │   ├── authLimits.ts         // Auth rate limits
│   │   ├── uploadLimits.ts       // Upload rate limits
│   │   └── __tests__/
│   ├── encryption/   // Data encryption
│   │   ├── fieldEncryption.ts    // Database field encryption
│   │   ├── fileEncryption.ts     // File encryption
│   │   ├── piiEncryption.ts      // PII data encryption
│   │   └── __tests__/
│   └── monitoring/   // Security monitoring
│       ├── securityLogs.ts       // Security event logging
│       ├── threatDetection.ts    // Threat monitoring
│       ├── vulnerabilityScanning.ts // Security scanning
│       └── __tests__/
└── docs/
    └── README.md
```

**Key Features:**
- Comprehensive GDPR compliance
- Advanced input validation
- Rate limiting and CSRF protection
- PII data encryption
- Security event monitoring

---

## **packages/payments/** - Payment Utilities
> **Payment processing utilities** shared between payment services

```typescript
payments/
├── package.json       // Dependencies: stripe, decimal.js
├── src/
│   ├── validation/   // Payment validation
│   │   ├── cardValidation.ts      // Credit card validation
│   │   ├── amountValidation.ts    // Amount validation
│   │   ├── currencyValidation.ts  // Currency validation
│   │   ├── taxValidation.ts       // Tax calculation validation
│   │   └── __tests__/
│   ├── calculations/ // Financial calculations
│   │   ├── revenueSharing.ts      // Revenue split calculations
│   │   ├── taxCalculations.ts     // Tax calculations
│   │   ├── feeCalculations.ts     // Platform fee calculations
│   │   ├── currencyConversion.ts  // Currency conversion
│   │   └── __tests__/
│   ├── formatting/   // Payment formatting
│   │   ├── currencyFormatting.ts  // Currency display
│   │   ├── dateFormatting.ts      // Payment date formatting
│   │   ├── receiptFormatting.ts   // Receipt generation
│   │   └── __tests__/
│   ├── types/        // Payment types
│   │   ├── Payment.ts             // Payment transaction
│   │   ├── Payout.ts             // Creator payout
│   │   ├── Subscription.ts        // Subscription billing
│   │   ├── TaxInfo.ts            // Tax information
│   │   └── index.ts
│   └── utils/        // Payment utilities
│       ├── stripe.ts             // Stripe helpers
│       ├── webhooks.ts           // Webhook utilities
│       ├── gdprPayments.ts       // GDPR payment compliance
│       └── __tests__/
└── docs/
    └── README.md
```

**Key Features:**
- Stripe integration utilities
- Revenue sharing calculations
- Multi-currency support
- Tax compliance tools
- GDPR payment compliance 