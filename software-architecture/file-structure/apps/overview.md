# Apps - Main Applications Overview

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