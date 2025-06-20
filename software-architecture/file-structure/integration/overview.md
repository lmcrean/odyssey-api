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
│   │   │   └── middleware.integration.test.ts          # Auth middleware + JWT service
│   │   ├── user/
│   │   │   ├── profile-management.integration.test.ts  # Get + Update + Delete profile controllers
│   │   │   ├── user-search.integration.test.ts         # Search + Filter + Pagination
│   │   │   └── unified-model.integration.test.ts       # Database operations together
│   │   └── health/
│   │       └── health-endpoints.integration.test.ts    # Health controllers + database
│   ├── web/                       # Frontend integration tests
│   │   ├── auth/
│   │   │   ├── auth-components.integration.test.ts     # LoginForm + AuthContext + Hooks
│   │   │   ├── auth-state.integration.test.ts          # State management + persistence
│   │   │   └── auth-routing.integration.test.ts        # Auth guards + route protection
│   │   ├── user/
│   │   │   ├── profile-components.integration.test.ts  # ProfileForm + ProfileView + API client
│   │   │   ├── user-search.integration.test.ts         # SearchForm + Results + Filters
│   │   │   └── profile-state.integration.test.ts       # State updates + cache + API calls
│   │   └── pages/
│   │       ├── dashboard.integration.test.ts           # Dashboard components working together
│   │       └── navigation.integration.test.ts          # Router + Navigation + Auth state
│   └── shared/                    # Shared integration utilities
│       ├── fixtures/              # Test data for integration tests
│       ├── helpers/               # Integration test helper functions
│       └── setup/                 # Integration test environment setup
├── e2e/                           # Cross-app user flows (Playwright)
│   └── runners/                   # E2E uses .api.ts/.web.ts pattern
└── apps/                          # Implementation + unit tests only
    ├── api/src/auth/__tests__/    # Unit tests only (single components)
    └── web/src/auth/__tests__/    # Unit tests only (single components)
```
