# apps/web - React Frontend (MVP)

> **MVP user interface** for creators and fans - essential features only for 100-500 creators

## MVP Overview  
The web application provides basic creator-fan interactions with simple content sharing and payment functionality.

## Tech Stack 
- **React 18** with TypeScript
- **Vite** for build tooling  
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Playwright** for E2E testing

## MVP File Structure 
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
│   └── robots.txt
├── src/
│   ├── main.tsx         // App entry point
│   ├── App.tsx          // Root component with routing
│   ├── components/      // UI components
│   │   ├── creator/     // Creator-specific components 
│   │   │   ├── Profile/
│   │   │   │   ├── CreatorProfile.tsx     // Basic creator profile
│   │   │   │   ├── ProfileEditor.tsx      // Edit profile info
│   │   │   │   └── __tests__/
│   │   │   ├── Content/
│   │   │   │   ├── ImageUpload.tsx        // Simple image upload
│   │   │   │   ├── ContentGrid.tsx        // Display creator's images
│   │   │   │   └── __tests__/
│   │   │   └── Earnings/
│   │   │       ├── EarningsView.tsx       // Basic earnings display
│   │   │       ├── TipHistory.tsx         // View received tips
│   │   │       └── __tests__/
│   │   ├── fan/         // Fan-specific components 
│   │   │   ├── Feed/
│   │   │   │   ├── ImageFeed.tsx          // Main image feed
│   │   │   │   ├── FeedPost.tsx           // Individual image post
│   │   │   │   └── __tests__/
│   │   │   ├── Discovery/
│   │   │   │   ├── CreatorGrid.tsx        // Browse creators
│   │   │   │   ├── CreatorCard.tsx        // Creator preview card
│   │   │   │   └── __tests__/
│   │   │   └── Support/
│   │   │       ├── TipButton.tsx          // Simple tip creator
│   │   │       ├── TipModal.tsx           // Tip amount selection
│   │   │       └── __tests__/
│   │   ├── shared/      // Shared components 
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.tsx             // Main app layout
│   │   │   │   ├── Header.tsx             // App header with nav
│   │   │   │   ├── Sidebar.tsx            // Basic navigation
│   │   │   │   └── __tests__/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthGuard.tsx          // Route protection
│   │   │   │   ├── LoginForm.tsx          // Basic login form
│   │   │   │   ├── SignupForm.tsx         // Basic registration
│   │   │   │   └── __tests__/
│   │   │   └── Media/
│   │   │       ├── ImageViewer.tsx        // Simple image display
│   │   │       ├── ImageUploader.tsx      // Cloudinary upload
│   │   │       └── __tests__/
│   │   └── ui/          // Basic design system 
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── __tests__/
│   ├── pages/           // Route components 
│   │   ├── Home.tsx               // Landing page
│   │   ├── Auth/
│   │   │   ├── Login.tsx          // Login page
│   │   │   └── Signup.tsx         // Registration page
│   │   ├── Creator/
│   │   │   ├── Dashboard.tsx      // Basic creator dashboard
│   │   │   ├── Profile.tsx        // Creator profile management
│   │   │   └── Earnings.tsx       // View earnings/tips
│   │   ├── Fan/
│   │   │   ├── Feed.tsx           // Main image feed
│   │   │   └── Discover.tsx       // Creator discovery
│   │   ├── Content/
│   │   │   └── ImageView.tsx      // Individual image view
│   │   └── __tests__/
│   ├── hooks/           // Custom React hooks 
│   │   ├── auth/
│   │   │   ├── useAuth.ts         // Authentication hook
│   │   │   └── __tests__/
│   │   ├── creator/
│   │   │   ├── useProfile.ts      // Creator profile operations
│   │   │   ├── useContent.ts      // Image management
│   │   │   └── __tests__/
│   │   ├── fan/
│   │   │   ├── useFeed.ts         // Image feed operations
│   │   │   └── __tests__/
│   │   └── payments/
│   │       ├── useTips.ts         // Simple tip functionality
│   │       └── __tests__/
│   ├── services/        // API communication 
│   │   ├── api/
│   │   │   ├── api.ts             // HTTP client configuration
│   │   │   ├── authAPI.ts         // Authentication API
│   │   │   ├── creatorAPI.ts      // Creator operations
│   │   │   ├── contentAPI.ts      // Image operations
│   │   │   ├── tipAPI.ts          // Simple tip payments
│   │   │   └── __tests__/
│   │   └── upload/
│   │       ├── imageUpload.ts     // Cloudinary image upload
│   │       └── __tests__/
│   ├── store/           // State management (Context API) 
│   │   ├── authContext.tsx        // Authentication state
│   │   ├── creatorContext.tsx     // Creator state
│   │   ├── contentContext.tsx     // Image content state
│   │   └── __tests__/
│   ├── types/           // TypeScript definitions 
│   │   ├── auth.ts               // Authentication types
│   │   ├── creator.ts            // Creator types
│   │   ├── content.ts            // Image content types
│   │   ├── payment.ts            // Basic tip types
│   │   └── api.ts               // API response types
│   ├── utils/           // Utility functions 
│   │   ├── formatters.ts         // Data formatting
│   │   ├── validators.ts         // Client-side validation
│   │   ├── constants.ts          // App constants
│   │   └── __tests__/
│   └── styles/          // Global styles 
│       ├── globals.css           // Global CSS with Tailwind
│       └── components.css        // Component-specific CSS
└── e2e/                 // Playwright E2E tests 
    ├── auth/
    │   ├── login.spec.ts         // Login flow tests
    │   └── signup.spec.ts        // Registration tests
    ├── creator/
    │   ├── profile.spec.ts       // Creator profile tests
    │   └── image-upload.spec.ts  // Image upload tests
    ├── fan/
    │   ├── feed.spec.ts          // Image feed tests
    │   ├── discovery.spec.ts     // Creator discovery tests
    │   └── tip.spec.ts           // Tip functionality tests
    └── utils/
        ├── test-helpers.ts       // Test utilities
        └── mock-data.ts         // Test data
```

## MVP Key Features 

### Creator Features (Essential Only)
- **Basic Profile**: Name, bio, profile picture, creator page
- **Image Upload**: Simple Cloudinary integration for photos only
- **Content Management**: View and organize uploaded images
- **Earnings View**: Basic display of received tips/donations
- **Creator Dashboard**: Simple overview of profile and content

### Fan Features (Essential Only)  
- **Image Feed**: Browse latest images from all creators
- **Creator Discovery**: Simple grid of creator profiles
- **Basic Interaction**: View creator profiles and images
- **Simple Tips**: One-click tip/donation to creators
- **User Profile**: Basic fan profile management

### Shared Features (Essential Only)
- **Authentication**: Email/password login and registration
- **Responsive Design**: Mobile-first responsive layouts
- **Image Display**: Fast image loading and viewing
- **Basic Navigation**: Header navigation and routing
- **Error Handling**: Basic error messages and validation

## MVP Environment Configuration 
```typescript
// .env.local
VITE_API_URL=https://odyssey-api-lmcreans-projects.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_CLOUDINARY_CLOUD_NAME=odyssey-creator
```

## MVP Success Metrics 
- **25+ Active Creators** posting weekly images
- **$2K+ Monthly GMV** in creator tips
- **500+ Registered Users** on platform
- **<2 second** image upload time
- **95%+ Payment Success** rate

## Features Excluded from MVP ❌
*These features are documented in web_i2.md for future implementation:*

- Video/audio content and live streaming
- Advanced analytics and creator insights
- Complex monetization (subscriptions, pay-per-view)
- Real-time features (chat, notifications, WebSocket)
- Advanced social features (comments, shares, follows)
- Content moderation tools
- GDPR compliance tools
- Multi-language support
- Advanced search and filtering
- Creator collaboration tools

## Deployment 
- **Vercel**: Static deployment optimized for React
- **CDN**: Global content delivery for images
- **Domain**: odyssey-lmcreans-projects.vercel.app 