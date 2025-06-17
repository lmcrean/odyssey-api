# MVP Focus Guide - What to Build vs Document

> **Strategy**: Keep full architecture documentation, implement minimally for MVP

## 🎯 Current Status Assessment

### ✅ Perfect - Keep as Documented
These align perfectly with MVP needs:

**Apps Structure:**
- `apps/web/` - React frontend (essential)
- `apps/api/` - Express backend (essential)
- `apps/payments/` - Minimal Stripe processing (clean separation)

**Core Packages:**
- `packages/shared/` - Types & utilities (essential)
- `packages/auth/` - JWT authentication (essential)
- `packages/ui/` - Basic components (essential)
- `packages/observability/` - E2E testing logs & correlation (essential for Playwright)

### 🔄 Simplify for MVP - Keep Documentation
These are over-engineered for MVP but documentation should stay:

**`apps/workers/` → Skip Initially**  
- **Current Doc**: Complex background job processing
- **MVP Reality**: Process images synchronously in API
- **Why Keep Doc**: Essential for scale, shows where features belong

**`packages/media/` → Image-Only**
- **Current Doc**: Full video/audio/live streaming processing  
- **MVP Reality**: Simple image upload/display with Cloudinary
- **Why Keep Doc**: Roadmap for expanding beyond images

### ❌ Overkill for MVP - But Keep Documentation

**Apps (Post-MVP):**
- `apps/admin/` - Platform management (not user-facing)
- Complex microservices architecture

**Packages (Post-MVP):**
- `packages/security/` - GDPR, advanced auth (basic security only)
- `packages/observability/` - Comprehensive monitoring (console.log initially) 
- `packages/payments/` - Complex financial processing (basic Stripe only)

## 📋 MVP Implementation Priority

### Week 1-2: Foundation
```typescript
// Create structure, minimal implementation
apps/
├── web/src/components/
│   ├── ImageUpload.tsx      # Cloudinary upload
│   ├── ImageFeed.tsx        # Display images  
│   └── PaymentButton.tsx    # Stripe payment

├── api/src/routes/
│   ├── auth.ts              # JWT login/register
│   ├── images.ts            # CRUD operations
│   └── payments.ts          # Basic Stripe

packages/
├── shared/src/types/
│   ├── User.ts              # Basic user types
│   └── Content.ts           # Image content types
└── ui/src/components/
    ├── Button.tsx           # Basic button
    └── Modal.tsx            # Basic modal
```

### Week 3-4: Core Features
- User authentication  
- Image upload/display
- Creator profiles
- Basic payments (tips/sponsorships)
- Simple image feed

### Week 5-6: Polish & Deploy
- Responsive design
- Error handling  
- Basic tests
- Vercel deployment

## 🚀 Why Keep "Overkill" Documentation?

### 1. **AI Coding Advantages**
```typescript
// AI understands this structure immediately:
"Add video upload to the media package"
// vs. confusing AI with:
"Add video to the mixed utils folder"
```

### 2. **Clear Growth Path**
- MVP: Basic image sharing
- Month 3: Add video (expand `packages/media/`)  
- Month 6: Add payments complexity (expand `apps/payments/`)
- Month 12: Add live streaming (activate workers)

### 3. **Contributor Onboarding**
- "I know Stripe" → Works on `packages/payments/`
- "I do React" → Works on `apps/web/`
- "I know infrastructure" → Works on `apps/workers/`

### 4. **No Refactoring Pain**
- Features grow into existing structure
- No massive reorganizations later
- No breaking import changes

## 🎨 MVP Feature Set

### Core User Stories
1. **Creator**: "I want to upload images and get paid by fans"
2. **Fan**: "I want to discover creators and support them"

### Essential Features Only
- ✅ User registration/login
- ✅ Creator profile pages  
- ✅ Image upload/display
- ✅ Image feed/discovery
- ✅ Tips/sponsorship payments
- ✅ Basic creator earnings view

### Skip for MVP
- ❌ Video/audio content
- ❌ Live streaming  
- ❌ Complex analytics
- ❌ Admin dashboard
- ❌ Content moderation
- ❌ Multi-currency
- ❌ Tax reporting
- ❌ GDPR compliance tools

## 🎯 Success Metrics
- **25+ Active Creators** posting weekly
- **$2K+ Monthly GMV** in creator earnings  
- **500+ Registered Users** on platform
- **<2 second** image upload time
- **95%+ Payment Success** rate

## Migration Strategy
1. **MVP**: Minimal implementations in full structure
2. **Month 3**: Migrate basic features to dedicated packages
3. **Month 6**: Add dedicated apps as needed
4. **Month 12**: Full architecture implementation 

## 🧪 E2E Testing Observability Requirements

### Why Observability is MVP-Essential
**Playwright E2E testing requires structured logging to:**
- **Correlate frontend/backend logs** during test execution
- **Track requests across apps** (web → api → payments)
- **Debug test failures** with complete request traces
- **Monitor SQLite + frontend console** concurrently

### MVP Observability Implementation
```typescript
packages/observability/src/
├── logging/
│   ├── winston-config.ts        # Structured JSON logs
│   ├── correlation.ts           # Request correlation IDs
│   └── playwright-transport.ts  # Test-friendly output
├── testing/
│   ├── test-logger.ts           # E2E test logging
│   └── trace-viewer.ts          # Request trace utilities
└── types/
    └── TestingTypes.ts          # Testing observability types
```

### E2E Testing Benefits
```typescript
// Each request gets correlation ID
POST /api/users/123 → correlationId: "req_abc123"
POST /payments/process → correlationId: "req_abc123"

// Playwright can trace complete flows
test('payment flow', async ({ page }) => {
  const correlationId = await startTrace();
  // ... test steps ...
  const logs = await getLogsByCorrelation(correlationId);
  expect(logs).toContain('payment.success');
});
``` 