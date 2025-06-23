# Odyssey - Creator Platform MVP Architecture

key: ✅ - MVP
key: 🔄 - MVP but bare minimal implementation, should be expanded later
key: ❌ - Not MVP but should be added later

## Overview
A TypeScript-first creator monetization platform built for **MVP deployment** with 100-500 initial creators. Instagram-ish image sharing with direct creator monetization.

## Architecture Principles
- **MVP-First**: Start simple, add complexity later
- **TypeScript First**: Type safety across all layers
- **Vercel Native**: Optimized for Vercel deployment
- **Creator-Centric**: Focus on creator-fan direct monetization
- **Apps/Packages Structure**: Future-proof architecture from day 1
- **Design System First**: UX-driven development with Figma integration

## MVP vs Post-MVP Breakdown

### 🎯 MVP Features (Instagram-ish + Payments)
**Core User Journey**: Creator signs up → Uploads images → Fan discovers → Fan pays creator

**Apps (MVP Implementation):**
- ✅ **apps/web** - React frontend (basic UI, image upload, payment flows)
- ✅ **apps/api** - Express API (auth, image handling, payment processing)
- ✅ **apps/ai** - Dedicated AI service (Gemini chat, memory, content generation)
- 🔄 **apps/payments** - payments (minimal implementation)
- ❌ **apps/workers** - Post-MVP (process images synchronously initially)
- ❌ **apps/admin** - Post-MVP (not user-facing)

**Packages (MVP Implementation):**
- ✅ **packages/shared** - Core types, basic utilities
- ✅ **packages/auth** - JWT authentication, basic validation
- ✅ **packages/ui** - Essential components (Button, Input, Modal, ImageUpload)
- 🔄 **packages/media** - Image upload/display only (no video/audio processing)
- 🔄 **packages/payments** - payments (minimal implementation)
- 🔄 **packages/observability** - E2E testing logs, correlation IDs (essential for Playwright)
- ❌ **packages/security** - Post-MVP (basic auth security only)

**e2e tests**
- ✅ **e2e/runners** - E2E tests for all apps
- ✅ **e2e/operations** - E2E tests for cross-app flows

**integration tests**
- ✅ **integration/runners** - Integration tests for all apps
- ✅ **integration/operations** - Integration tests for cross-app flows
- ✅ **integration/pages** - Integration tests for web pages
- ✅ **integration/api** - Integration tests for api endpoints
- ✅ **integration/payments** - Integration tests for payments
- ✅ **integration/auth** - Integration tests for auth

**ux-design**
- ✅ **ux-design/Contributing.md** - Design system and Figma integration guide
- ✅ **ux-design/** - Design documentation and user experience guidelines

**platform integrations**
- ✅ **platform-integrations.md** - Comprehensive external service integration status and documentation

### 🚀 Post-MVP Features (Scale & Polish)
**When you have 100+ creators and $10K+ monthly GMV:**

**Advanced Apps:**
- **apps/payments** - Dedicated payment processing, tax handling
- **apps/workers** - Background image processing, notifications
- **apps/admin** - Creator management, platform analytics

**Advanced Packages:**
- **packages/media** - Full video/audio processing, live streaming
- **packages/payments** - Multi-currency, fraud detection, tax compliance
- **packages/security** - GDPR tools, advanced auth, rate limiting
- **packages/observability** - Comprehensive monitoring, creator analytics

### 📋 MVP Implementation Checklist

**Week 1-2: Core Setup**
```typescript
apps/web/
├── src/pages/
│   ├── Home.tsx              # Landing page
│   ├── Login.tsx             # Authentication
│   ├── CreatorProfile.tsx    # Creator page
│   └── Feed.tsx              # Image feed
├── src/components/
│   ├── ImageUpload.tsx       # Image upload
│   ├── PaymentButton.tsx     # Stripe payment
│   └── ImageGallery.tsx      # Display images

apps/api/
├── src/routes/
│   ├── auth.ts               # Login/register
│   ├── users.ts              # User profiles
│   └── images.ts             # Image upload/display

apps/payments/                 # 🔄 Minimal but separate
├── src/routes/
│   ├── process.ts            # Process payments
│   ├── webhooks.ts           # Stripe webhooks
│   └── status.ts             # Payment status
├── src/services/
│   └── StripeService.ts      # Basic Stripe integration
└── vercel.json               # Separate deployment config
```

**Week 3-4: MVP Features**
- User authentication (JWT)
- Image upload to Cloudinary
- Creator profile pages
- Basic payment processing
- Simple image feed

**Week 5-6: Polish & Deploy**
- Responsive design
- Error handling
- Basic tests
- Vercel deployment

**Post-MVP: Gemini AI Migration**
- Migrate chat system from `.archive/backend-js-reference/`
- Integrate Gemini API with new apps/api structure
- Add chat endpoints to API documentation
- Implement conversation management and history

## What's Documented vs What We'll Build

### Keep Full Documentation (No Deletion Needed)
The detailed apps/ and packages/ documentation stays as-is because:
- 🏗️ **Structure guidance** - Shows where features belong as you grow
- 🤖 **AI coding help** - AI tools understand the intended architecture
- 👥 **Contributor clarity** - Open source contributors know where to add features
- 📈 **Growth roadmap** - Clear path from MVP to full platform

### MVP Implementation Strategy
1. **Create the full apps/packages structure** (folders + minimal files)
2. **Implement only MVP features** (marked with ✅ above)
3. **Stub out Post-MVP features** (marked with ❌ above)
4. **Gradually migrate** from basic implementations to full features

## Success Metrics (MVP)
- **50+ Active Creators**: Creators posting regularly
- **$5K+ Monthly GMV**: Gross merchandise value
- **1K+ Registered Users**: Total platform users
- **80%+ Payment Success**: Reliable payment processing

## Migration Path
The apps/packages structure ensures smooth migration:
1. **MVP**: Minimal implementations in existing structure
2. **Scale**: Gradually move features to dedicated apps/packages  
3. **Growth**: Add new apps/packages without refactoring existing code

## Deployment Strategy - GitHub Actions + Vercel

### 🚀 **Isolated Apps Deployment**
Each app deploys as separate Vercel project while importing shared packages:

```typescript
// Deployment targets
apps/web/     → odyssey-web-lmcreans-projects.vercel.app
apps/api/     → odyssey-api-lmcreans-projects.vercel.app
apps/ai/      → odyssey-ai-lmcreans-projects.vercel.app
apps/payments/ → odyssey-payments-lmcreans-projects.vercel.app
```

### 📋 **GitHub Actions Workflow Structure**

```typescript
.github/workflows/
├── pull-request-commit-triggers/
│   └── deploy-vercel-fullstack.yml      # PR commits trigger deployment
└── pull-request-merged-to-main-triggers/
    └── deploy-vercel-fullstack.yml      # Main branch deployment
```

### 🔄 **Pull Request Deployment Workflow**
```yaml
# .github/workflows/pull-request-commit-triggers/deploy-vercel-fullstack.yml
name: Deploy Fullstack to Vercel (PR)

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - 'apps/**'
      - 'packages/**'

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm ci
          npm run build:packages  # Build shared packages first
      
      - name: Deploy Web App
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_WEB_PROJECT_ID }}
          working-directory: ./apps/web
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-api:
    runs-on: ubuntu-latest
    needs: deploy-web  # Deploy in order
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm ci
          npm run build:packages  # Build shared packages first
      
      - name: Deploy API App
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_API_PROJECT_ID }}
          working-directory: ./apps/api
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-payments:
    runs-on: ubuntu-latest
    needs: deploy-api  # Deploy in order
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm ci
          npm run build:packages  # Build shared packages first
      
      - name: Deploy Payments App
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PAYMENTS_PROJECT_ID }}
          working-directory: ./apps/payments
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

### 🎯 **Main Branch Deployment Workflow**
```yaml
# .github/workflows/pull-request-merged-to-main-triggers/deploy-vercel-fullstack.yml
name: Deploy Fullstack to Vercel (Production)

on:
  push:
    branches: [main]
    paths:
      - 'apps/**'
      - 'packages/**'

jobs:
  test-before-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install and test
        run: |
          npm ci
          npm run build:packages
          npm run test:unit
          npm run test:integration
          npm run test:e2e:prod  # Test against production

  deploy-production:
    runs-on: ubuntu-latest
    needs: test-before-deploy
    strategy:
      matrix:
        app: [web, api, payments]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm ci
          npm run build:packages
      
      - name: Deploy ${{ matrix.app }} to Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets[format('VERCEL_{0}_PROJECT_ID', upper(matrix.app))] }}
          working-directory: ./apps/${{ matrix.app }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

### 📦 **Package Import Strategy**

Each app imports packages dynamically during build:

```typescript
// apps/web/package.json
{
  "name": "@odyssey/web",
  "dependencies": {
    "@odyssey/shared": "workspace:*",
    "@odyssey/auth": "workspace:*", 
    "@odyssey/ui": "workspace:*",
    "@odyssey/media": "workspace:*"
  }
}

// apps/api/package.json  
{
  "name": "@odyssey/api",
  "dependencies": {
    "@odyssey/shared": "workspace:*",
    "@odyssey/auth": "workspace:*",
    "@odyssey/observability": "workspace:*"
  }
}

// apps/payments/package.json
{
  "name": "@odyssey/payments", 
  "dependencies": {
    "@odyssey/shared": "workspace:*",
    "@odyssey/auth": "workspace:*",
    "@odyssey/payments": "workspace:*",
    "@odyssey/observability": "workspace:*"
  }
}
```

### 🔧 **Vercel Configuration per App**

```typescript
// apps/web/vercel.json
{
  "buildCommand": "npm run build:packages && npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://odyssey-api-lmcreans-projects.vercel.app",
    "VITE_PAYMENTS_URL": "https://odyssey-payments-lmcreans-projects.vercel.app"
  }
}

// apps/api/vercel.json
{
  "buildCommand": "npm run build:packages && npm run build",
  "outputDirectory": "dist", 
  "installCommand": "npm ci",
  "framework": null,
  "functions": {
    "dist/server.js": {
      "runtime": "nodejs18.x"
    }
  }
}

// apps/payments/vercel.json
{
  "buildCommand": "npm run build:packages && npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci", 
  "framework": null,
  "functions": {
    "dist/server.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 🏗️ **Build Script Strategy**

```typescript
// Root package.json
{
  "scripts": {
    "build:packages": "npm run build --workspaces --if-present",
    "build:web": "npm run build:packages && npm run build --workspace=apps/web",
    "build:api": "npm run build:packages && npm run build --workspace=apps/api", 
    "build:payments": "npm run build:packages && npm run build --workspace=apps/payments",
    "deploy:web": "cd apps/web && vercel --prod",
    "deploy:api": "cd apps/api && vercel --prod",
    "deploy:payments": "cd apps/payments && vercel --prod"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### 🔒 **Environment Variables Strategy**

```typescript
// GitHub Secrets needed:
VERCEL_TOKEN                 # Vercel deployment token
VERCEL_ORG_ID               # Vercel organization ID
VERCEL_WEB_PROJECT_ID       # Web app project ID
VERCEL_API_PROJECT_ID       # API app project ID  
VERCEL_PAYMENTS_PROJECT_ID  # Payments app project ID

// Each app gets environment-specific variables:
// Web App
VITE_API_URL=https://odyssey-api-lmcreans-projects.vercel.app
VITE_PAYMENTS_URL=https://odyssey-payments-lmcreans-projects.vercel.app

// API App  
DATABASE_URL=postgresql://...          # Neon PostgreSQL connection
JWT_SECRET=...                        # JWT signing secret
CLOUDINARY_CLOUD_NAME=...             # Cloudinary configuration
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...                    # Google Gemini AI integration
GEMINI_MODEL=gemini-2.0-flash         # AI model configuration
CHAT_SYSTEM_PROMPT=...                # AI assistant prompt

// Payments App
STRIPE_SECRET_KEY=...                 # Stripe payment processing
STRIPE_WEBHOOK_SECRET=...             # Stripe webhook validation
DATABASE_URL=postgresql://...          # Shared Neon database
```

### 🧪 **Testing Integration with Deployment**

```typescript
// Test against deployed environments
npm run test:e2e:dev    # Test against preview deployments
npm run test:e2e:prod   # Test against production deployments

// Environment-specific test configs
playwright.dev.config.ts    # Points to preview URLs
playwright.prod.config.ts   # Points to production URLs
```

This deployment strategy ensures:
- **Isolated app deployments** with shared package dependencies
- **Ordered deployment** (web → api → payments)  
- **Environment-specific testing** before production
- **Dynamic package imports** during build process
- **Scalable CI/CD** that grows with your apps/packages structure
