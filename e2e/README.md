# Odyssey E2E Testing Suite

> **Cross-app integration testing** using Playwright with the Runners Pattern

## Overview
This directory contains all end-to-end testing for the Odyssey platform, implementing a **single test entry point** with **reusable runners** that can test across all apps (web, api, payments, etc.).

## Architecture

### Single Test Entry Point
- **`master-integration.spec.ts`** - The ONLY test spec file
- All test scenarios are orchestrated through this single file
- Prevents test file proliferation and maintains consistency

### Runners Pattern
```
runners/
├── auth/           # Authentication domain runners
├── user/           # User management runners  
├── health/         # Health check runners
└── operations/     # Cross-domain orchestration
```

### Operations Orchestration
- **Operations** compose multiple runners into complex flows
- **Runners** handle individual actions (login, register, etc.)
- **Reusable** across different test scenarios

## Usage

### Development Testing
```bash
npm run test:dev
```

### Production Testing
```bash
npm run test:prod
```

### Interactive Testing
```bash
npm run test:ui
```

## Key Benefits

1. **Cross-App Testing**: Test complete user journeys across web → api → payments
2. **Single Source of Truth**: One test file to rule them all
3. **Runners Pattern**: Reusable, maintainable, AI-friendly
4. **Domain Organization**: Matches apps/packages structure
5. **Correlation Tracking**: Track requests across all apps

## Apps Integration

This e2e suite can test:
- **Web App** (`apps/web`) - Frontend interactions
- **API App** (`apps/api`) - Backend API endpoints  
- **Payments App** (`apps/payments`) - Payment processing
- **Workers App** (`apps/workers`) - Background jobs
- **Admin App** (`apps/admin`) - Admin dashboard

## Configuration

- **`playwright.config.ts`** - Main configuration
- **`playwright.dev.config.ts`** - Development environment
- **`playwright.prod.config.ts`** - Production environment

## Migration from App-Specific E2E

This root-level e2e structure replaces:
- ❌ `apps/api/e2e/` (moved here)
- ❌ `apps/web/e2e/` (consolidated here)
- ❌ Individual app test files (unified in master-integration.spec.ts)

All testing is now centralized for better maintainability and cross-app coverage. 