# E2E Testing Architecture - Basic Structure

> **Testing Strategy**: Each endpoint = unique runner file, organized by app type (API/Web)

## Overview
Comprehensive end-to-end testing using Playwright with a **runners pattern** that provides modular, reusable, and maintainable test components. Each API endpoint and web interaction gets its own runner class, organized by domain and app type.

## Basic File Structure

```bash
odyssey/e2e/
├── master-integration.spec.ts    # Single test file that runs everything
├── playwright.config.ts          # Global Playwright config
└── runners/
    ├── auth/                     # Authentication domain
    │   ├── login/
    │   │   ├── login.api.ts      # Backend API endpoint testing
    │   │   └── login.web.ts      # Frontend UI testing
    │   ├── register/
    │   │   ├── register.api.ts   
    │   │   └── register.web.ts   
    │   ├── refresh-token/
    │   │   ├── refreshToken.api.ts
    │   │   └── refreshToken.web.ts
    │   └── logout/
    │       ├── logout.api.ts     
    │       └── logout.web.ts     
    ├── user/                     # User management domain
    │   ├── profile/
    │   │   ├── getProfile.api.ts
    │   │   ├── getPublicProfile.api.ts
    │   │   ├── updateProfile.api.ts
    │   │   └── profile.web.ts    # UI for viewing/editing profile
    │   ├── search/
    │   │   ├── searchUsers.api.ts
    │   │   └── search.web.ts
    │   └── username/
    │       ├── checkUsername.api.ts
    │       └── username.web.ts
    ├── chat/                     # Messaging/Chat domain
    │   ├── messages/
    │   │   ├── sendMessage.api.ts
    │   │   ├── getMessages.api.ts
    │   │   ├── deleteMessage.api.ts
    │   │   └── messages.web.ts   # Chat UI interactions
    │   ├── conversations/
    │   │   ├── createConversation.api.ts
    │   │   ├── getConversations.api.ts
    │   │   ├── deleteConversation.api.ts
    │   │   └── conversations.web.ts
    │   ├── channels/
    │   │   ├── createChannel.api.ts
    │   │   ├── joinChannel.api.ts
    │   │   ├── leaveChannel.api.ts
    │   │   └── channels.web.ts
    │   └── real-time/
    │       ├── messageStreaming.api.ts
    │       └── realTimeChat.web.ts
    ├── health/                   # System health domain
    │   ├── status/
    │   │   ├── healthCheck.api.ts
    │   │   └── status.web.ts     # Health dashboard UI
    │   ├── database/
    │   │   ├── dbHealth.api.ts
    │   │   └── dbStatus.web.ts
    │   └── monitoring/
    │       ├── systemMetrics.api.ts
    │       └── monitoring.web.ts
    ├── content/                  # Content management domain
    │   ├── upload/
    │   │   ├── uploadImage.api.ts
    │   │   ├── uploadVideo.api.ts
    │   │   └── upload.web.ts
    │   ├── manage/
    │   │   ├── deleteContent.api.ts
    │   │   ├── updateContent.api.ts
    │   │   └── manage.web.ts
    │   └── media/
    │       ├── processMedia.api.ts
    │       └── mediaGallery.web.ts
    ├── payments/                 # Payment processing domain
    │   ├── create/
    │   │   ├── createPayment.api.ts
    │   │   ├── createSubscription.api.ts
    │   │   └── create.web.ts
    │   ├── process/
    │   │   ├── processPayment.api.ts
    │   │   ├── refundPayment.api.ts
    │   │   └── process.web.ts
    │   ├── billing/
    │   │   ├── getBillingHistory.api.ts
    │   │   ├── updateBillingInfo.api.ts
    │   │   └── billing.web.ts
    │   └── subscriptions/
    │       ├── manageSubscription.api.ts
    │       └── subscriptions.web.ts
    └── operations/              # Cross-domain orchestration
        ├── auth/
        │   ├── authFlow.api.ts   # Backend-only auth operations
        │   └── authFlow.web.ts   # Frontend-only auth operations
        ├── user/
        │   ├── userFlow.api.ts   # Backend user operations
        │   └── userFlow.web.ts   # Frontend user operations
        ├── chat/
        │   ├── messagingFlow.api.ts  # Backend messaging operations
        │   └── messagingFlow.web.ts  # Frontend chat interactions
        ├── health/
        │   ├── monitoringFlow.api.ts # Backend health monitoring
        │   └── monitoringFlow.web.ts # Frontend health dashboard
        ├── content/
        │   ├── contentFlow.api.ts
        │   └── contentFlow.web.ts
        └── payments/
            ├── paymentFlow.api.ts
            └── paymentFlow.web.ts
```

## Runner Pattern Principles

### 1. App-Specific File Naming
```
{action}.api.ts    # Backend API endpoint testing
{action}.web.ts    # Frontend UI interaction testing
```

### 2. Domain-First Organization
- Related functionality grouped by domain, then by app
- Each domain contains multiple features
- Each feature has both API and Web runners

### 3. Separate Testing Buckets
- API Testing: Fast, no browser overhead
- Web Testing: Browser-based, UI validation
- Operations: Cross-domain orchestration

## Testing Commands

```bash
# Test all API endpoints
npx playwright test --project=api-tests

# Test all web interactions
npx playwright test --project=web-tests

# Test specific domain
npx playwright test --project=api-tests --grep="auth"
npx playwright test --project=web-tests --grep="user"
```
