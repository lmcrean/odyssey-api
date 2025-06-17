# apps/web - React Frontend

> **Main user interface** for creators and fans, built with React + TypeScript + Vite

## Overview
The web application serves both creators and fans with role-based interfaces, content creation tools, and monetization features.

## Tech Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Playwright** for E2E testing

## File Structure
```typescript
web/
├── package.json            // Dependencies: react, typescript, vite, tailwind
├── vite.config.ts         // Vite configuration
├── vercel.json           // Vercel deployment config
├── playwright.config.ts  // E2E test configuration
├── tailwind.config.ts    // Tailwind configuration
├── tsconfig.json         // TypeScript configuration
├── public/
│   ├── favicon.ico
│   ├── manifest.json     // PWA manifest
│   └── robots.txt
├── src/
│   ├── main.tsx         // App entry point
│   ├── App.tsx          // Root component with routing
│   ├── components/      // UI components
│   │   ├── creator/     // Creator-specific components
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.tsx      // Main creator dashboard
│   │   │   │   ├── RevenueChart.tsx   // Revenue analytics
│   │   │   │   ├── ContentStats.tsx   // Content performance
│   │   │   │   └── __tests__/
│   │   │   ├── Content/
│   │   │   │   ├── ContentUpload.tsx    // Media upload interface
│   │   │   │   ├── ContentEditor.tsx    // Content editing
│   │   │   │   ├── ContentLibrary.tsx   // Content management
│   │   │   │   └── __tests__/
│   │   │   ├── Monetization/
│   │   │   │   ├── SponsorshipPanel.tsx // Sponsorship management
│   │   │   │   ├── SubscriptionTiers.tsx // Subscription setup
│   │   │   │   ├── PayoutSettings.tsx   // Payout configuration
│   │   │   │   └── __tests__/
│   │   │   └── Analytics/
│   │   │       ├── AnalyticsDashboard.tsx // Detailed analytics
│   │   │       ├── AudienceInsights.tsx   // Audience data
│   │   │       ├── EngagementMetrics.tsx  // Engagement stats
│   │   │       └── __tests__/
│   │   ├── fan/         // Fan-specific components  
│   │   │   ├── Feed/
│   │   │   │   ├── FeedView.tsx         // Main content feed
│   │   │   │   ├── FeedPost.tsx         // Individual post
│   │   │   │   ├── FeedFilters.tsx      // Content filters
│   │   │   │   └── __tests__/
│   │   │   ├── Creator/
│   │   │   │   ├── CreatorProfile.tsx   // Creator profile view
│   │   │   │   ├── CreatorContent.tsx   // Creator's content
│   │   │   │   ├── SponsorButton.tsx    // Support creator
│   │   │   │   └── __tests__/
│   │   │   ├── Discovery/
│   │   │   │   ├── DiscoverFeed.tsx     // Discover new creators
│   │   │   │   ├── TrendingContent.tsx  // Trending content
│   │   │   │   ├── CategoryBrowser.tsx  // Browse by category
│   │   │   │   └── __tests__/
│   │   │   └── Subscriptions/
│   │   │       ├── SubscriptionManager.tsx // Manage subscriptions
│   │   │       ├── PaymentHistory.tsx      // Payment history
│   │   │       ├── SubscriptionCard.tsx    // Subscription display
│   │   │       └── __tests__/
│   │   ├── shared/      // Shared components
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.tsx           // Main app layout
│   │   │   │   ├── Header.tsx           // App header
│   │   │   │   ├── Sidebar.tsx          // Navigation sidebar
│   │   │   │   ├── Footer.tsx          // App footer
│   │   │   │   └── __tests__/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthGuard.tsx        // Route protection
│   │   │   │   ├── LoginModal.tsx       // Login modal
│   │   │   │   ├── SignupModal.tsx      // Registration modal
│   │   │   │   ├── GDPRConsent.tsx     // GDPR consent
│   │   │   │   └── __tests__/
│   │   │   ├── Media/
│   │   │   │   ├── MediaPlayer.tsx      // Video/audio player
│   │   │   │   ├── ImageGallery.tsx     // Image carousel
│   │   │   │   ├── LiveStream.tsx       // Live streaming
│   │   │   │   └── __tests__/
│   │   │   └── Navigation/
│   │   │       ├── NavBar.tsx           // Main navigation
│   │   │       ├── BreadcrumbNav.tsx    // Breadcrumb navigation
│   │   │       ├── TabNavigation.tsx    // Tab navigation
│   │   │       └── __tests__/
│   │   └── ui/          // Design system components (from @packages/ui)
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── __tests__/
│   ├── pages/           // Route components
│   │   ├── Home.tsx               // Landing page
│   │   ├── Auth/
│   │   │   ├── Login.tsx          // Login page
│   │   │   ├── Signup.tsx         // Registration page
│   │   │   └── ForgotPassword.tsx // Password reset
│   │   ├── Creator/
│   │   │   ├── Dashboard.tsx      // Creator dashboard
│   │   │   ├── Analytics.tsx      // Analytics page
│   │   │   ├── Content.tsx        // Content management
│   │   │   ├── Earnings.tsx       // Earnings page
│   │   │   └── Settings.tsx       // Creator settings
│   │   ├── Fan/
│   │   │   ├── Feed.tsx           // Main feed
│   │   │   ├── Discover.tsx       // Discovery page
│   │   │   ├── Subscriptions.tsx  // Subscription management
│   │   │   └── Profile.tsx        // Fan profile
│   │   ├── Content/
│   │   │   ├── ContentView.tsx    // Individual content view
│   │   │   ├── LiveStream.tsx     // Live streaming page
│   │   │   └── Search.tsx         // Content search
│   │   └── __tests__/
│   ├── hooks/           // Custom React hooks
│   │   ├── auth/
│   │   │   ├── useAuth.ts         // Authentication hook
│   │   │   ├── useSession.ts      // Session management
│   │   │   └── __tests__/
│   │   ├── creator/
│   │   │   ├── useCreator.ts      // Creator operations
│   │   │   ├── useAnalytics.ts    // Analytics data
│   │   │   ├── useContent.ts      // Content management
│   │   │   └── __tests__/
│   │   ├── fan/
│   │   │   ├── useFeed.ts         // Feed operations
│   │   │   ├── useSubscriptions.ts // Subscription management
│   │   │   └── __tests__/
│   │   ├── payments/
│   │   │   ├── usePayments.ts     // Payment operations
│   │   │   ├── useSponsorship.ts  // Sponsorship handling
│   │   │   └── __tests__/
│   │   └── media/
│   │       ├── useUpload.ts       // File upload
│   │       ├── useMediaPlayer.ts  // Media playback
│   │       └── __tests__/
│   ├── services/        // API communication
│   │   ├── api/
│   │   │   ├── api.ts             // HTTP client configuration
│   │   │   ├── authAPI.ts         // Authentication API
│   │   │   ├── creatorAPI.ts      // Creator API calls
│   │   │   ├── fanAPI.ts          // Fan API calls
│   │   │   ├── contentAPI.ts      // Content API calls
│   │   │   ├── paymentAPI.ts      // Payment API calls
│   │   │   └── __tests__/
│   │   ├── websocket/
│   │   │   ├── websocket.ts       // WebSocket client
│   │   │   ├── liveChat.ts        // Live chat functionality
│   │   │   ├── notifications.ts   // Real-time notifications
│   │   │   └── __tests__/
│   │   └── upload/
│   │       ├── fileUpload.ts      // File upload service
│   │       ├── mediaProcessing.ts // Media processing
│   │       └── __tests__/
│   ├── store/           // State management (Zustand)
│   │   ├── authStore.ts           // Authentication state
│   │   ├── creatorStore.ts        // Creator state
│   │   ├── fanStore.ts           // Fan state
│   │   ├── contentStore.ts        // Content state
│   │   ├── paymentStore.ts        // Payment state
│   │   ├── uiStore.ts            // UI state (modals, etc.)
│   │   └── __tests__/
│   ├── types/           // TypeScript definitions
│   │   ├── auth.ts               // Authentication types
│   │   ├── creator.ts            // Creator types
│   │   ├── fan.ts               // Fan types
│   │   ├── content.ts            // Content types
│   │   ├── payment.ts            // Payment types
│   │   ├── api.ts               // API response types
│   │   └── ui.ts                // UI component types
│   ├── utils/           // Utility functions
│   │   ├── formatters.ts         // Data formatting
│   │   ├── validators.ts         // Client-side validation
│   │   ├── constants.ts          // App constants
│   │   ├── helpers.ts            // Helper functions
│   │   └── __tests__/
│   └── styles/          // Global styles
│       ├── globals.css           // Global CSS
│       ├── components.css        // Component-specific CSS
│       └── animations.css        // Animation definitions
└── e2e/                 // Playwright E2E tests
    ├── auth/
    │   ├── login.spec.ts         // Login flow tests
    │   ├── signup.spec.ts        // Registration tests
    │   └── gdpr.spec.ts         // GDPR compliance tests
    ├── creator/
    │   ├── dashboard.spec.ts     // Creator dashboard tests
    │   ├── content-upload.spec.ts // Content upload tests
    │   ├── monetization.spec.ts  // Monetization tests
    │   └── analytics.spec.ts     // Analytics tests
    ├── fan/
    │   ├── feed.spec.ts          // Feed browsing tests
    │   ├── discovery.spec.ts     // Content discovery tests
    │   ├── sponsorship.spec.ts   // Sponsorship tests
    │   └── subscriptions.spec.ts // Subscription tests
    ├── payments/
    │   ├── payment-flow.spec.ts  // Payment processing tests
    │   ├── payout.spec.ts       // Creator payout tests
    │   └── subscription.spec.ts  // Subscription billing tests
    └── utils/
        ├── test-helpers.ts       // Test utilities
        ├── mock-data.ts         // Test data
        └── page-objects.ts      // Page object models
```

## Key Features

### Creator Features
- **Revenue Dashboard**: Real-time earnings, analytics, and performance metrics
- **Content Management**: Upload, edit, and organize photos, videos, live streams
- **Monetization Tools**: Sponsorship management, subscription tiers, tip jars
- **Audience Analytics**: Detailed insights into audience behavior and engagement
- **Live Streaming**: Real-time broadcasting with interactive chat

### Fan Features
- **Personalized Feed**: Algorithm-driven content discovery
- **Creator Discovery**: Browse and discover new creators by category
- **Subscription Management**: Manage creator subscriptions and billing
- **Interactive Features**: Like, comment, share, and sponsor content
- **Real-time Notifications**: Updates on new content and live streams

### Shared Features
- **GDPR Compliance**: Comprehensive privacy controls and data management
- **Responsive Design**: Mobile-first design with desktop optimization
- **Accessibility**: WCAG 2.1 AA compliant
- **Progressive Web App**: Offline functionality and native app-like experience
- **Real-time Updates**: WebSocket-based live updates and notifications

## Environment Configuration
```typescript
// .env.local
VITE_API_URL=https://odyssey-api-lmcreans-projects.vercel.app
VITE_WEBSOCKET_URL=wss://odyssey-ws-lmcreans-projects.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_CLOUDINARY_CLOUD_NAME=odyssey-creator
VITE_GOOGLE_OAUTH_CLIENT_ID=...
VITE_MIXPANEL_TOKEN=...
```

## Deployment
- **Vercel**: Optimized for Vercel static deployment
- **CDN**: Global content delivery for fast loading
- **Edge Functions**: Server-side rendering where needed
- **Analytics**: Built-in Vercel Analytics and custom tracking 