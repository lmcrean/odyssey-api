# Integration Testing Architecture - Root-Level Multi-Component Testing

> **Integration Testing Strategy**: Test multiple components working together within the same app - Root folder for strategic visibility

## Overview
Integration tests verify that multiple units (controllers, services, models, components) work correctly together within a single app domain. Unlike E2E tests that test complete user flows across apps, integration tests focus on **within-app component interaction** using Vitest for fast, reliable testing. Integration testing is **strategically important** and deserves root-level prominence in our TDD architecture.

## Root-Level Integration Structure

```bash
odyssey/
├── integration/                   # Root level - first-class citizen
│   ├── package.json               # Integration-specific dependencies
│   ├── vitest.config.ts           # Integration-specific Vitest config
│   ├── api/                       # Backend integration tests
│   │   ├── auth/
│   │   │   ├── auth-flow.integration.test.ts           # Login + Register + Logout controllers
│   │   │   ├── validation-service.integration.test.ts  # ValidationService + AuthService
│   │   │   ├── middleware.integration.test.ts          # Auth middleware + JWT service
│   │   │   ├── refresh-token.integration.test.ts       # Token refresh + validation flow
│   │   │   └── password-reset.integration.test.ts      # Password reset workflow
│   │   ├── user/
│   │   │   ├── profile-management.integration.test.ts  # Get + Update + Delete profile controllers
│   │   │   ├── user-search.integration.test.ts         # Search + Filter + Pagination
│   │   │   ├── unified-model.integration.test.ts       # Database operations together
│   │   │   ├── username-validation.integration.test.ts # Username check + availability
│   │   │   └── public-profile.integration.test.ts      # Public profile + privacy settings
│   │   ├── chat/
│   │   │   ├── messaging-flow.integration.test.ts      # Send + Get + Delete messages
│   │   │   ├── conversation-management.integration.test.ts # Create + Manage conversations
│   │   │   ├── channel-operations.integration.test.ts  # Create + Join + Leave channels
│   │   │   ├── real-time-messaging.integration.test.ts # WebSocket + message streaming
│   │   │   └── message-validation.integration.test.ts  # Content validation + filtering
│   │   ├── content/
│   │   │   ├── media-upload.integration.test.ts        # Upload + Validation + Storage
│   │   │   ├── content-management.integration.test.ts  # Create + Update + Delete content
│   │   │   ├── media-processing.integration.test.ts    # Image/Video processing pipeline
│   │   │   ├── content-moderation.integration.test.ts  # Content filtering + approval
│   │   │   └── media-optimization.integration.test.ts  # Compression + CDN integration
│   │   ├── payments/
│   │   │   ├── payment-processing.integration.test.ts  # Create + Process + Confirm payments
│   │   │   ├── subscription-management.integration.test.ts # Create + Update + Cancel subscriptions
│   │   │   ├── billing-operations.integration.test.ts  # Billing history + invoice generation
│   │   │   ├── payment-webhooks.integration.test.ts    # Stripe webhooks + database updates
│   │   │   └── refund-processing.integration.test.ts   # Refund workflow + notifications
│   │   └── health/
│   │       ├── health-endpoints.integration.test.ts    # Health controllers + database
│   │       ├── monitoring-systems.integration.test.ts  # Metrics + alerts + reporting
│   │       └── database-health.integration.test.ts     # DB connections + performance checks
│   ├── web/                       # Frontend integration tests
│   │   ├── auth/
│   │   │   ├── auth-components.integration.test.ts     # LoginForm + AuthContext + Hooks
│   │   │   ├── auth-state.integration.test.ts          # State management + persistence
│   │   │   ├── auth-routing.integration.test.ts        # Auth guards + route protection
│   │   │   ├── registration-flow.integration.test.ts   # Multi-step registration process
│   │   │   └── password-reset.integration.test.ts      # Password reset UI flow
│   │   ├── user/
│   │   │   ├── profile-components.integration.test.ts  # ProfileForm + ProfileView + API client
│   │   │   ├── user-search.integration.test.ts         # SearchForm + Results + Filters
│   │   │   ├── profile-state.integration.test.ts       # State updates + cache + API calls
│   │   │   ├── username-checker.integration.test.ts    # Real-time username availability
│   │   │   └── profile-settings.integration.test.ts    # Privacy + notification settings
│   │   ├── chat/
│   │   │   ├── chat-interface.integration.test.ts      # ChatWindow + MessageList + Input
│   │   │   ├── conversation-ui.integration.test.ts     # ConversationList + Navigation
│   │   │   ├── channel-management.integration.test.ts  # Channel creation + moderation UI
│   │   │   ├── real-time-chat.integration.test.ts      # WebSocket + live messaging UI
│   │   │   └── message-composer.integration.test.ts    # Rich text + media + emoji integration
│   │   ├── content/
│   │   │   ├── content-creation.integration.test.ts    # Editor + Preview + Publishing
│   │   │   ├── media-uploader.integration.test.ts      # Drag-drop + Progress + Validation
│   │   │   ├── content-gallery.integration.test.ts     # Grid + Filters + Pagination
│   │   │   ├── content-editor.integration.test.ts      # Rich editor + Auto-save + Versioning
│   │   │   └── media-library.integration.test.ts       # Asset browser + Search + Organization
│   │   ├── payments/
│   │   │   ├── payment-forms.integration.test.ts       # Payment UI + Validation + Stripe
│   │   │   ├── subscription-dashboard.integration.test.ts # Billing + Plans + Upgrades
│   │   │   ├── billing-history.integration.test.ts     # Invoice list + Downloads + Filters
│   │   │   ├── payment-methods.integration.test.ts     # Add/Remove cards + Default selection
│   │   │   └── checkout-flow.integration.test.ts       # Multi-step purchase process
│   │   ├── health/
│   │   │   ├── admin-dashboard.integration.test.ts     # System metrics + alerts UI
│   │   │   ├── monitoring-widgets.integration.test.ts  # Charts + Graphs + Real-time data
│   │   │   └── health-status.integration.test.ts       # Status indicators + Error reporting
│   │   └── pages/
│   │       ├── dashboard.integration.test.ts           # Dashboard components working together
│   │       ├── navigation.integration.test.ts          # Router + Navigation + Auth state
│   │       ├── homepage.integration.test.ts            # Landing page + Hero + Features
│   │       ├── settings.integration.test.ts            # Settings tabs + Forms + Persistence
│   │       └── onboarding.integration.test.ts          # Multi-step user onboarding flow
│   └── shared/                    # Shared integration utilities
│       ├── fixtures/              # Test data for integration tests
│       │   ├── auth/              # User accounts, tokens, auth states
│       │   ├── chat/              # Messages, conversations, channels
│       │   ├── content/           # Media files, content samples
│       │   └── payments/          # Payment data, subscriptions, billing
│       ├── helpers/               # Integration test helper functions
│       │   ├── auth-helpers.ts    # Common auth setup/teardown
│       │   ├── chat-helpers.ts    # Message/conversation utilities
│       │   ├── content-helpers.ts # Media upload/download utilities
│       │   └── payment-helpers.ts # Payment/subscription test utilities
│       └── setup/                 # Integration test environment setup
│           ├── database-setup.ts  # Test database initialization
│           ├── api-setup.ts       # API mocking and configuration
│           └── web-setup.ts       # Frontend testing environment
├── e2e/                           # Cross-app user flows (Playwright)
│   └── runners/                   # E2E uses .api.ts/.web.ts pattern
└── apps/                          # Implementation + unit tests only
    ├── api/src/auth/__tests__/    # Unit tests only (single components)
    └── web/src/auth/__tests__/    # Unit tests only (single components)
```
