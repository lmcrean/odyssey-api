# Odyssey

## File Structure
```
odyssey/
├── package.json                 # Root workspace config
├── turbo.json                   # Turborepo config
├── .gitignore
├── README.md
├── docker-compose.yml           # Local development
├── .env.example
├── playwright.config.ts         # E2E test configuration
├── jest.config.js              # Global Jest configuration
│
├── apps/
│   ├── web/                     # **React + Vite Frontend** - Main user interface
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   ├── playwright.config.ts
│   │   ├── jest.config.js
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── manifest.json
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   │   ├── Feed/
│   │   │   │   │   ├── FeedPost.tsx
│   │   │   │   │   ├── FeedStories.tsx
│   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   ├── FeedPost.test.tsx
│   │   │   │   │   │   └── FeedStories.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Profile/
│   │   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   │   ├── ProfileGrid.tsx
│   │   │   │   │   ├── CreatorStats.tsx
│   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   ├── ProfileHeader.test.tsx
│   │   │   │   │   │   ├── ProfileGrid.test.tsx
│   │   │   │   │   │   └── CreatorStats.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Upload/
│   │   │   │   │   ├── PhotoUpload.tsx
│   │   │   │   │   ├── VideoUpload.tsx
│   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   ├── PhotoUpload.test.tsx
│   │   │   │   │   │   └── VideoUpload.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Monetization/
│   │   │   │   │   ├── SponsorButton.tsx
│   │   │   │   │   ├── SubscriptionTiers.tsx
│   │   │   │   │   ├── PaymentModal.tsx
│   │   │   │   │   ├── CreatorDashboard.tsx
│   │   │   │   │   ├── SponsorshipHistory.tsx
│   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   ├── SponsorButton.test.tsx
│   │   │   │   │   │   ├── SubscriptionTiers.test.tsx
│   │   │   │   │   │   ├── PaymentModal.test.tsx
│   │   │   │   │   │   ├── CreatorDashboard.test.tsx
│   │   │   │   │   │   └── SponsorshipHistory.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── Layout/
│   │   │   │       ├── Sidebar.tsx
│   │   │   │       ├── Header.tsx
│   │   │   │       ├── __tests__/
│   │   │   │       │   ├── Sidebar.test.tsx
│   │   │   │       │   └── Header.test.tsx
│   │   │   │       └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── Explore.tsx
│   │   │   │   ├── Messages.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── CreatorDashboard.tsx
│   │   │   │   ├── Earnings.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   └── __tests__/
│   │   │   │       ├── Home.test.tsx
│   │   │   │       ├── Profile.test.tsx
│   │   │   │       ├── Explore.test.tsx
│   │   │   │       ├── Messages.test.tsx
│   │   │   │       ├── Login.test.tsx
│   │   │   │       ├── CreatorDashboard.test.tsx
│   │   │   │       ├── Earnings.test.tsx
│   │   │   │       └── Settings.test.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useFeed.ts
│   │   │   │   ├── useProfile.ts
│   │   │   │   ├── useUpload.ts
│   │   │   │   ├── useSponsorship.ts
│   │   │   │   ├── usePayments.ts
│   │   │   │   └── __tests__/
│   │   │   │       ├── useFeed.test.ts
│   │   │   │       ├── useProfile.test.ts
│   │   │   │       ├── useUpload.test.ts
│   │   │   │       ├── useSponsorship.test.ts
│   │   │   │       └── usePayments.test.ts
│   │   │   ├── services/
│   │   │   │   ├── api.ts
│   │   │   │   ├── websocket.ts
│   │   │   │   └── __tests__/
│   │   │   │       ├── api.test.ts
│   │   │   │       └── websocket.test.ts
│   │   │   ├── store/
│   │   │   │   ├── index.ts
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── feedSlice.ts
│   │   │   │   ├── profileSlice.ts
│   │   │   │   ├── paymentsSlice.ts
│   │   │   │   ├── sponsorshipSlice.ts
│   │   │   │   └── __tests__/
│   │   │   │       ├── authSlice.test.ts
│   │   │   │       ├── feedSlice.test.ts
│   │   │   │       ├── profileSlice.test.ts
│   │   │   │       ├── paymentsSlice.test.ts
│   │   │   │       └── sponsorshipSlice.test.ts
│   │   │   └── utils/
│   │   │       ├── constants.ts
│   │   │       ├── helpers.ts
│   │   │       └── __tests__/
│   │   │           ├── constants.test.ts
│   │   │           └── helpers.test.ts
│   │   └── e2e/                 # **E2E Tests** - Playwright end-to-end testing
│   │       ├── runners/
│   │       │   ├── auth.spec.ts
│   │       │   ├── feed.spec.ts
│   │       │   ├── profile.spec.ts
│   │       │   ├── upload.spec.ts
│   │       │   ├── monetization.spec.ts
│   │       │   ├── payments.spec.ts
│   │       │   └── sponsorship.spec.ts
│   │       ├── fixtures/
│   │       │   ├── testData.ts
│   │       │   ├── mockUsers.ts
│   │       │   └── paymentMocks.ts
│   │       └── utils/
│   │           ├── testHelpers.ts
│   │           └── pageObjects.ts
│   │
│   ├── payments/                # **Payment & Monetization** - Stripe integration system
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── jest.config.js
│   │   └── src/
│   │       ├── client/
│   │       │   ├── hooks/
│   │       │   │   ├── useStripe.ts
│   │       │   │   ├── usePayments.ts
│   │       │   │   ├── useSubscriptions.ts
│   │       │   │   ├── useSponsorships.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── useStripe.test.ts
│   │       │   │       ├── usePayments.test.ts
│   │       │   │       ├── useSubscriptions.test.ts
│   │       │   │       └── useSponsorships.test.ts
│   │       │   ├── components/
│   │       │   │   ├── StripeWrapper.tsx
│   │       │   │   ├── PaymentForm.tsx
│   │       │   │   ├── SubscriptionCard.tsx
│   │       │   │   ├── SponsorButton.tsx
│   │       │   │   └── __tests__/
│   │       │   │       ├── StripeWrapper.test.tsx
│   │       │   │       ├── PaymentForm.test.tsx
│   │       │   │       ├── SubscriptionCard.test.tsx
│   │       │   │       └── SponsorButton.test.tsx
│   │       │   └── utils/
│   │       │       ├── stripe.ts
│   │       │       ├── formatting.ts
│   │       │       └── __tests__/
│   │       │           ├── stripe.test.ts
│   │       │           └── formatting.test.ts
│   │       ├── server/
│   │       │   ├── services/
│   │       │   │   ├── StripeService.ts
│   │       │   │   ├── PaymentService.ts
│   │       │   │   ├── SubscriptionService.ts
│   │       │   │   ├── PayoutService.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── StripeService.test.ts
│   │       │   │       ├── PaymentService.test.ts
│   │       │   │       ├── SubscriptionService.test.ts
│   │       │   │       └── PayoutService.test.ts
│   │       │   ├── middleware/
│   │       │   │   ├── stripeWebhook.ts
│   │       │   │   ├── paymentAuth.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── stripeWebhook.test.ts
│   │       │   │       └── paymentAuth.test.ts
│   │       │   └── utils/
│   │       │       ├── calculations.ts
│   │       │       ├── validation.ts
│   │       │       └── __tests__/
│   │       │           ├── calculations.test.ts
│   │       │           └── validation.test.ts
│   │       ├── types/
│   │       │   ├── Payment.ts
│   │       │   ├── Subscription.ts
│   │       │   ├── Sponsorship.ts
│   │       │   ├── Payout.ts
│   │       │   └── index.ts
│   │       └── validation/
│   │           ├── paymentSchemas.ts
│   │           ├── subscriptionSchemas.ts
│   │           ├── index.ts
│   │           └── __tests__/
│   │               ├── paymentSchemas.test.ts
│   │               └── subscriptionSchemas.test.ts
│   │
│   └── api/                     # **Express Backend** - Core API server
│       ├── package.json
│       ├── tsconfig.json
│       ├── nodemon.json
│       ├── Dockerfile
│       ├── jest.config.js
│       └── src/
│           ├── index.ts
│           ├── app.ts
│           ├── routes/
│           │   ├── auth.ts
│           │   ├── users.ts
│           │   ├── posts.ts
│           │   ├── comments.ts
│           │   ├── likes.ts
│           │   ├── follows.ts
│           │   ├── stories.ts
│           │   ├── messages.ts
│           │   ├── upload.ts
│           │   ├── payments.ts
│           │   ├── subscriptions.ts
│           │   ├── sponsorships.ts
│           │   ├── webhooks.ts
│           │   └── __tests__/
│           │       ├── auth.test.ts
│           │       ├── users.test.ts
│           │       ├── posts.test.ts
│           │       ├── comments.test.ts
│           │       ├── likes.test.ts
│           │       ├── follows.test.ts
│           │       ├── stories.test.ts
│           │       ├── messages.test.ts
│           │       ├── upload.test.ts
│           │       ├── payments.test.ts
│           │       ├── subscriptions.test.ts
│           │       ├── sponsorships.test.ts
│           │       └── webhooks.test.ts
│           ├── controllers/
│           │   ├── AuthController.ts
│           │   ├── UserController.ts
│           │   ├── PostController.ts
│           │   ├── CommentController.ts
│           │   ├── LikeController.ts
│           │   ├── FollowController.ts
│           │   ├── StoryController.ts
│           │   ├── MessageController.ts
│           │   ├── UploadController.ts
│           │   ├── PaymentController.ts
│           │   ├── SubscriptionController.ts
│           │   ├── SponsorshipController.ts
│           │   ├── WebhookController.ts
│           │   └── __tests__/
│           │       ├── AuthController.test.ts
│           │       ├── UserController.test.ts
│           │       ├── PostController.test.ts
│           │       ├── CommentController.test.ts
│           │       ├── LikeController.test.ts
│           │       ├── FollowController.test.ts
│           │       ├── StoryController.test.ts
│           │       ├── MessageController.test.ts
│           │       ├── UploadController.test.ts
│           │       ├── PaymentController.test.ts
│           │       ├── SubscriptionController.test.ts
│           │       ├── SponsorshipController.test.ts
│           │       └── WebhookController.test.ts
│           ├── models/
│           │   ├── User.ts
│           │   ├── Post.ts
│           │   ├── Comment.ts
│           │   ├── Like.ts
│           │   ├── Follow.ts
│           │   ├── Story.ts
│           │   ├── Message.ts
│           │   ├── Subscription.ts
│           │   ├── Payment.ts
│           │   ├── Sponsorship.ts
│           │   └── __tests__/
│           │       ├── User.test.ts
│           │       ├── Post.test.ts
│           │       ├── Comment.test.ts
│           │       ├── Like.test.ts
│           │       ├── Follow.test.ts
│           │       ├── Story.test.ts
│           │       ├── Message.test.ts
│           │       ├── Subscription.test.ts
│           │       ├── Payment.test.ts
│           │       └── Sponsorship.test.ts
│           ├── services/
│           │   ├── DatabaseService.ts
│           │   ├── ImageService.ts
│           │   ├── VideoService.ts
│           │   ├── NotificationService.ts
│           │   ├── EmailService.ts
│           │   ├── StripeService.ts
│           │   ├── PaymentService.ts
│           │   ├── AnalyticsService.ts
│           │   └── __tests__/
│           │       ├── DatabaseService.test.ts
│           │       ├── ImageService.test.ts
│           │       ├── VideoService.test.ts
│           │       ├── NotificationService.test.ts
│           │       ├── EmailService.test.ts
│           │       ├── StripeService.test.ts
│           │       ├── PaymentService.test.ts
│           │       └── AnalyticsService.test.ts
│           ├── middleware/
│           │   ├── auth.ts
│           │   ├── validation.ts
│           │   ├── upload.ts
│           │   ├── rateLimit.ts
│           │   ├── cors.ts
│           │   └── __tests__/
│           │       ├── auth.test.ts
│           │       ├── validation.test.ts
│           │       ├── upload.test.ts
│           │       ├── rateLimit.test.ts
│           │       └── cors.test.ts
│           ├── database/
│           │   ├── connection.ts
│           │   ├── migrations/
│           │   ├── seeds/
│           │   └── __tests__/
│           │       └── connection.test.ts
│           ├── websocket/
│           │   ├── handlers/
│           │   │   ├── messageHandler.ts
│           │   │   ├── notificationHandler.ts
│           │   │   ├── liveHandler.ts
│           │   │   └── __tests__/
│           │   │       ├── messageHandler.test.ts
│           │   │       ├── notificationHandler.test.ts
│           │   │       └── liveHandler.test.ts
│           │   ├── index.ts
│           │   └── __tests__/
│           │       └── index.test.ts
│           └── utils/
│               ├── logger.ts
│               ├── errors.ts
│               ├── helpers.ts
│               └── __tests__/
│                   ├── logger.test.ts
│                   ├── errors.test.ts
│                   └── helpers.test.ts
│
├── packages/
│   ├── shared/                  # **Shared Utilities** - Types, validation, constants
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── jest.config.js
│   │   └── src/
│   │       ├── types/
│   │       │   ├── User.ts
│   │       │   ├── Post.ts
│   │       │   ├── Comment.ts
│   │       │   ├── Message.ts
│   │       │   ├── Story.ts
│   │       │   ├── Payment.ts
│   │       │   ├── Subscription.ts
│   │       │   ├── Sponsorship.ts
│   │       │   ├── index.ts
│   │       │   └── __tests__/
│   │       │       ├── User.test.ts
│   │       │       ├── Post.test.ts
│   │       │       ├── Comment.test.ts
│   │       │       ├── Message.test.ts
│   │       │       ├── Story.test.ts
│   │       │       ├── Payment.test.ts
│   │       │       ├── Subscription.test.ts
│   │       │       └── Sponsorship.test.ts
│   │       ├── validation/
│   │       │   ├── userSchemas.ts
│   │       │   ├── postSchemas.ts
│   │       │   ├── commentSchemas.ts
│   │       │   ├── paymentSchemas.ts
│   │       │   ├── subscriptionSchemas.ts
│   │       │   ├── index.ts
│   │       │   └── __tests__/
│   │       │       ├── userSchemas.test.ts
│   │       │       ├── postSchemas.test.ts
│   │       │       ├── commentSchemas.test.ts
│   │       │       ├── paymentSchemas.test.ts
│   │       │       └── subscriptionSchemas.test.ts
│   │       ├── constants/
│   │       │   ├── errors.ts
│   │       │   ├── limits.ts
│   │       │   ├── index.ts
│   │       │   └── __tests__/
│   │       │       ├── errors.test.ts
│   │       │       └── limits.test.ts
│   │       └── utils/
│   │           ├── formatters.ts
│   │           ├── validators.ts
│   │           ├── index.ts
│   │           └── __tests__/
│   │               ├── formatters.test.ts
│   │               └── validators.test.ts
│   │
│   ├── auth/                    # **Authentication** - Login, signup, JWT handling
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── jest.config.js
│   │   └── src/
│   │       ├── client/
│   │       │   ├── hooks/
│   │       │   │   ├── useAuth.ts
│   │       │   │   ├── useLogin.ts
│   │       │   │   ├── useSignup.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── useAuth.test.ts
│   │       │   │       ├── useLogin.test.ts
│   │       │   │       └── useSignup.test.ts
│   │       │   ├── context/
│   │       │   │   ├── AuthContext.tsx
│   │       │   │   └── __tests__/
│   │       │   │       └── AuthContext.test.tsx
│   │       │   └── utils/
│   │       │       ├── storage.ts
│   │       │       ├── api.ts
│   │       │       └── __tests__/
│   │       │           ├── storage.test.ts
│   │       │           └── api.test.ts
│   │       ├── server/
│   │       │   ├── middleware/
│   │       │   │   ├── authenticate.ts
│   │       │   │   ├── authorize.ts
│   │       │   │   ├── refresh.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── authenticate.test.ts
│   │       │   │       ├── authorize.test.ts
│   │       │   │       └── refresh.test.ts
│   │       │   ├── services/
│   │       │   │   ├── TokenService.ts
│   │       │   │   ├── PasswordService.ts
│   │       │   │   ├── OAuthService.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── TokenService.test.ts
│   │       │   │       ├── PasswordService.test.ts
│   │       │   │       └── OAuthService.test.ts
│   │       │   └── utils/
│   │       │       ├── jwt.ts
│   │       │       ├── crypto.ts
│   │       │       └── __tests__/
│   │       │           ├── jwt.test.ts
│   │       │           └── crypto.test.ts
│   │       ├── types/
│   │       │   ├── AuthUser.ts
│   │       │   ├── Tokens.ts
│   │       │   └── index.ts
│   │       └── validation/
│   │           ├── loginSchema.ts
│   │           ├── signupSchema.ts
│   │           ├── index.ts
│   │           └── __tests__/
│   │               ├── loginSchema.test.ts
│   │               └── signupSchema.test.ts
│   │
│   ├── ui/                      # **Design System** - Reusable UI components
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.js
│   │   ├── jest.config.js
│   │   └── src/
│   │       ├── components/
│   │       │   ├── Avatar/
│   │       │   │   ├── Avatar.tsx
│   │       │   │   ├── AvatarGroup.tsx
│   │       │   │   ├── index.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── Avatar.test.tsx
│   │       │   │       └── AvatarGroup.test.tsx
│   │       │   ├── Button/
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── IconButton.tsx
│   │       │   │   ├── index.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── Button.test.tsx
│   │       │   │       └── IconButton.test.tsx
│   │       │   ├── Input/
│   │       │   │   ├── Input.tsx
│   │       │   │   ├── TextArea.tsx
│   │       │   │   ├── index.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── Input.test.tsx
│   │       │   │       └── TextArea.test.tsx
│   │       │   ├── Modal/
│   │       │   │   ├── Modal.tsx
│   │       │   │   ├── ModalDialog.tsx
│   │       │   │   ├── index.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── Modal.test.tsx
│   │       │   │       └── ModalDialog.test.tsx
│   │       │   ├── Card/
│   │       │   │   ├── Card.tsx
│   │       │   │   ├── CardHeader.tsx
│   │       │   │   ├── index.ts
│   │       │   │   └── __tests__/
│   │       │   │       ├── Card.test.tsx
│   │       │   │       └── CardHeader.test.tsx
│   │       │   └── Loading/
│   │       │       ├── Spinner.tsx
│   │       │       ├── Skeleton.tsx
│   │       │       ├── index.ts
│   │       │       └── __tests__/
│   │       │           ├── Spinner.test.tsx
│   │       │           └── Skeleton.test.tsx
│   │       ├── icons/
│   │       │   ├── Heart.tsx
│   │       │   ├── Comment.tsx
│   │       │   ├── Share.tsx
│   │       │   ├── index.ts
│   │       │   └── __tests__/
│   │       │       ├── Heart.test.tsx
│   │       │       ├── Comment.test.tsx
│   │       │       └── Share.test.tsx
│   │       ├── styles/
│   │       │   ├── globals.css
│   │       │   └── components.css
│   │       └── utils/
│   │           ├── cn.ts
│   │           ├── theme.ts
│   │           └── __tests__/
│   │               ├── cn.test.ts
│   │               └── theme.test.ts
│   │
│   └── media/                   # **Media Processing** - Image/video compression & uploads
│       ├── package.json
│       ├── tsconfig.json
│       ├── jest.config.js
│       └── src/
│           ├── image/
│           │   ├── compress.ts
│           │   ├── resize.ts
│           │   ├── filters.ts
│           │   ├── index.ts
│           │   └── __tests__/
│           │       ├── compress.test.ts
│           │       ├── resize.test.ts
│           │       └── filters.test.ts
│           ├── video/
│           │   ├── compress.ts
│           │   ├── thumbnail.ts
│           │   ├── transcode.ts
│           │   ├── index.ts
│           │   └── __tests__/
│           │       ├── compress.test.ts
│           │       ├── thumbnail.test.ts
│           │       └── transcode.test.ts
│           ├── upload/
│           │   ├── s3.ts
│           │   ├── cloudinary.ts
│           │   ├── index.ts
│           │   └── __tests__/
│           │       ├── s3.test.ts
│           │       └── cloudinary.test.ts
│           └── types/
│               ├── MediaFile.ts
│               └── index.ts
│
├── e2e/                         # **Global E2E Tests** - Cross-app integration testing
│   ├── runners/
│   │   ├── user-journey.spec.ts
│   │   ├── creator-workflow.spec.ts
│   │   ├── payment-flow.spec.ts
│   │   ├── subscription-flow.spec.ts
│   │   └── api-integration.spec.ts
│   ├── fixtures/
│   │   ├── globalTestData.ts
│   │   ├── apiMocks.ts
│   │   └── databaseSeeds.ts
│   └── utils/
│       ├── globalHelpers.ts
│       └── crossAppPages.ts
│
├── docs/                        # **Documentation** - API, deployment, architecture
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   ├── TESTING.md
│   └── ARCHITECTURE.md
│
├── scripts/                     # **Build & Deployment** - Automation scripts
│   ├── build.sh
├── scripts/                     # **Build & Deployment** - Automation scripts
│   ├── build.sh
│   ├── deploy.sh
│   ├── db-migrate.sh
│   ├── seed.sh
│   ├── test.sh
│   └── e2e-test.sh
│
└── infra/                       # **Infrastructure as Code** - Docker, Terraform, K8s
   ├── docker/
   │   ├── api.Dockerfile
   │   ├── web.Dockerfile
   │   └── test.Dockerfile
   ├── terraform/
   │   ├── main.tf
   │   ├── variables.tf
   │   └── outputs.tf
   └── k8s/
       ├── api-deployment.yaml
       ├── web-deployment.yaml
       └── ingress.yaml
```

