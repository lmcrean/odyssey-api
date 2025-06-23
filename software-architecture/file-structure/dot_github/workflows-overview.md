# GitHub Actions CI/CD - Odyssey Deployment Strategy

> **Deployment Philosophy**: Isolated apps with shared packages, ordered deployment, environment-specific testing

## Overview
Comprehensive CI/CD pipeline using GitHub Actions + Vercel for deploying multiple isolated apps that share common packages. Each app deploys independently while maintaining shared dependencies.

## Deployment Architecture

### 🚀 **Isolated Apps Strategy**
```typescript
// Each app = separate Vercel deployment
apps/web/     → odyssey-web-lmcreans-projects.vercel.app
apps/api/     → odyssey-api-lmcreans-projects.vercel.app  
apps/payments/ → odyssey-payments-lmcreans-projects.vercel.app

// Shared packages imported by all apps
packages/shared/       → @odyssey/shared
packages/auth/         → @odyssey/auth
packages/ui/           → @odyssey/ui
packages/media/        → @odyssey/media
packages/payments/     → @odyssey/payments
packages/observability/ → @odyssey/observability
```

## Workflow Structure

### 📋 **GitHub Actions Organization**
```typescript
.github/workflows/
├── pull-request-commit-triggers/
│   └── deploy-vercel-fullstack.yml      # PR commits → preview deployments
├── pull-request-merged-to-main-triggers/
│   └── deploy-vercel-fullstack.yml      # Main branch → production deployments
├── test-runners/
│   ├── unit-tests.yml                   # Vitest unit tests
│   ├── integration-tests.yml            # Vitest integration tests
│   └── e2e-tests.yml                    # Playwright E2E tests
└── utilities/
    ├── package-build.yml                # Shared package building
    └── environment-setup.yml            # Common setup steps
```

## Pull Request Deployment Workflow

### 🔄 **Preview Deployment on PR Commits**
```yaml
# .github/workflows/pull-request-commit-triggers/deploy-vercel-fullstack.yml
name: Deploy Fullstack to Vercel (PR Preview)

on:
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - 'apps/**'
      - 'packages/**'
      - '.github/workflows/**'

env:
  NODE_VERSION: '18'
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}

jobs:
  build-packages:
    name: Build Shared Packages
    runs-on: ubuntu-latest
    outputs:
      packages-hash: ${{ steps.hash.outputs.packages-hash }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build packages
        run: npm run build:packages
      
      - name: Generate packages hash
        id: hash
        run: echo "packages-hash=$(find packages -name '*.ts' -o -name '*.json' | xargs sha256sum | sha256sum | cut -d' ' -f1)" >> $GITHUB_OUTPUT
      
      - name: Cache built packages
        uses: actions/cache@v3
        with:
          path: |
            packages/*/dist
            packages/*/build
          key: packages-${{ steps.hash.outputs.packages-hash }}

  deploy-web:
    name: Deploy Web App (Preview)
    runs-on: ubuntu-latest
    needs: build-packages
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Restore packages cache
        uses: actions/cache@v3
        with:
          path: |
            packages/*/dist
            packages/*/build
          key: packages-${{ needs.build-packages.outputs.packages-hash }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy Web App to Vercel
        uses: amondnet/vercel-action@v25
        id: vercel-deploy-web
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_WEB_PROJECT_ID }}
          working-directory: ./apps/web
          vercel-args: '--build-env VITE_API_URL=${{ steps.vercel-deploy-api.outputs.preview-url || env.FALLBACK_API_URL }}'
          scope: ${{ secrets.VERCEL_ORG_ID }}
    
    outputs:
      web-url: ${{ steps.vercel-deploy-web.outputs.preview-url }}

  deploy-api:
    name: Deploy API App (Preview)
    runs-on: ubuntu-latest
    needs: [build-packages, deploy-web]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Restore packages cache
        uses: actions/cache@v3
        with:
          path: |
            packages/*/dist
            packages/*/build
          key: packages-${{ needs.build-packages.outputs.packages-hash }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy API App to Vercel
        uses: amondnet/vercel-action@v25
        id: vercel-deploy-api
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_API_PROJECT_ID }}
          working-directory: ./apps/api
          scope: ${{ secrets.VERCEL_ORG_ID }}
    
    outputs:
      api-url: ${{ steps.vercel-deploy-api.outputs.preview-url }}

  deploy-ai:
    name: Deploy AI App (Preview)
    runs-on: ubuntu-latest
    needs: [build-packages, deploy-api]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Restore packages cache
        uses: actions/cache@v3
        with:
          path: |
            packages/*/dist
            packages/*/build
          key: packages-${{ needs.build-packages.outputs.packages-hash }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy AI App to Vercel
        uses: amondnet/vercel-action@v25
        id: vercel-deploy-ai
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_AI_PROJECT_ID }}
          working-directory: ./apps/ai
          scope: ${{ secrets.VERCEL_ORG_ID }}
    
    outputs:
      ai-url: ${{ steps.vercel-deploy-ai.outputs.preview-url }}

  deploy-payments:
    name: Deploy Payments App (Preview)
    runs-on: ubuntu-latest
    needs: [build-packages, deploy-ai]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Restore packages cache
        uses: actions/cache@v3
        with:
          path: |
            packages/*/dist
            packages/*/build
          key: packages-${{ needs.build-packages.outputs.packages-hash }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy Payments App to Vercel
        uses: amondnet/vercel-action@v25
        id: vercel-deploy-payments
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PAYMENTS_PROJECT_ID }}
          working-directory: ./apps/payments
          scope: ${{ secrets.VERCEL_ORG_ID }}
    
    outputs:
      payments-url: ${{ steps.vercel-deploy-payments.outputs.preview-url }}

  test-preview-deployment:
    name: Test Preview Deployment
    runs-on: ubuntu-latest
    needs: [deploy-web, deploy-api, deploy-ai, deploy-payments]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run E2E tests against preview
        run: |
          export PLAYWRIGHT_WEB_URL="${{ needs.deploy-web.outputs.web-url }}"
          export PLAYWRIGHT_API_URL="${{ needs.deploy-api.outputs.api-url }}"
          export PLAYWRIGHT_AI_URL="${{ needs.deploy-ai.outputs.ai-url }}"
          export PLAYWRIGHT_PAYMENTS_URL="${{ needs.deploy-payments.outputs.payments-url }}"
          npm run test:e2e:preview
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: preview-test-results
          path: |
            test-results/
            playwright-report/

  comment-preview-urls:
    name: Comment Preview URLs
    runs-on: ubuntu-latest
    needs: [deploy-web, deploy-api, deploy-ai, deploy-payments, test-preview-deployment]
    if: always()
    steps:
      - name: Comment PR with preview URLs
        uses: actions/github-script@v6
        with:
          script: |
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            
            const botComment = comments.find(comment => 
              comment.user.type === 'Bot' && comment.body.includes('🚀 Preview Deployment')
            );
            
            const body = `## 🚀 Preview Deployment Ready!
            
            | App | URL | Status |
            |-----|-----|--------|
            | **Web** | [${{ needs.deploy-web.outputs.web-url }}](${{ needs.deploy-web.outputs.web-url }}) | ✅ Deployed |
            | **API** | [${{ needs.deploy-api.outputs.api-url }}](${{ needs.deploy-api.outputs.api-url }}) | ✅ Deployed |
            | **AI** | [${{ needs.deploy-ai.outputs.ai-url }}](${{ needs.deploy-ai.outputs.ai-url }}) | ✅ Deployed |
            | **Payments** | [${{ needs.deploy-payments.outputs.payments-url }}](${{ needs.deploy-payments.outputs.payments-url }}) | ✅ Deployed |
            
            ### 🧪 Test Results
            ${{ needs.test-preview-deployment.result == 'success' && '✅ All E2E tests passed' || '❌ Some tests failed - check workflow logs' }}
            
            ---
            *Updated automatically on every commit*`;
            
            if (botComment) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: botComment.id,
                body: body
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: body
              });
            }
```

## Production Deployment Workflow

### 🎯 **Production Deployment on Main Branch**
```yaml
# .github/workflows/pull-request-merged-to-main-triggers/deploy-vercel-fullstack.yml
name: Deploy Fullstack to Vercel (Production)

on:
  push:
    branches: [main]
    paths:
      - 'apps/**'
      - 'packages/**'

env:
  NODE_VERSION: '18'
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}

jobs:
  pre-deployment-tests:
    name: Pre-Deployment Testing
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build packages
        run: npm run build:packages
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run E2E tests against current production
        run: npm run test:e2e:prod
        env:
          PLAYWRIGHT_WEB_URL: https://odyssey-web-lmcreans-projects.vercel.app
          PLAYWRIGHT_API_URL: https://odyssey-api-lmcreans-projects.vercel.app
          PLAYWRIGHT_AI_URL: https://odyssey-ai-lmcreans-projects.vercel.app
          PLAYWRIGHT_PAYMENTS_URL: https://odyssey-payments-lmcreans-projects.vercel.app

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: pre-deployment-tests
    strategy:
      matrix:
        app: [web, api, ai, payments]
        include:
          - app: web
            project-id-secret: VERCEL_WEB_PROJECT_ID
            working-directory: ./apps/web
          - app: api
            project-id-secret: VERCEL_API_PROJECT_ID
            working-directory: ./apps/api
          - app: ai
            project-id-secret: VERCEL_AI_PROJECT_ID
            working-directory: ./apps/ai
          - app: payments
            project-id-secret: VERCEL_PAYMENTS_PROJECT_ID
            working-directory: ./apps/payments
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build packages
        run: npm run build:packages
      
      - name: Deploy ${{ matrix.app }} to Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets[matrix.project-id-secret] }}
          working-directory: ${{ matrix.working-directory }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

  post-deployment-tests:
    name: Post-Deployment Testing
    runs-on: ubuntu-latest
    needs: deploy-production
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Wait for deployments to be ready
        run: sleep 30
      
      - name: Run E2E tests against new production
        run: npm run test:e2e:prod
        env:
          PLAYWRIGHT_WEB_URL: https://odyssey-web-lmcreans-projects.vercel.app
          PLAYWRIGHT_API_URL: https://odyssey-api-lmcreans-projects.vercel.app
          PLAYWRIGHT_PAYMENTS_URL: https://odyssey-payments-lmcreans-projects.vercel.app
      
      - name: Upload production test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: production-test-results
          path: |
            test-results/
            playwright-report/

  notify-deployment:
    name: Notify Deployment Status
    runs-on: ubuntu-latest
    needs: [deploy-production, post-deployment-tests]
    if: always()
    steps:
      - name: Notify deployment success
        if: needs.deploy-production.result == 'success' && needs.post-deployment-tests.result == 'success'
        run: |
          echo "🚀 Production deployment successful!"
          echo "Web: https://odyssey-web-lmcreans-projects.vercel.app"
          echo "API: https://odyssey-api-lmcreans-projects.vercel.app"
          echo "Payments: https://odyssey-payments-lmcreans-projects.vercel.app"
      
      - name: Notify deployment failure
        if: needs.deploy-production.result == 'failure' || needs.post-deployment-tests.result == 'failure'
        run: |
          echo "❌ Production deployment failed!"
          exit 1
```

## Package & App Configuration

### 📦 **Workspace Package Strategy**
```typescript
// Root package.json - Workspace configuration
{
  "name": "@odyssey/root",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build:packages": "npm run build --workspaces --if-present",
    "build:web": "npm run build:packages && npm run build --workspace=apps/web",
    "build:api": "npm run build:packages && npm run build --workspace=apps/api",
    "build:payments": "npm run build:packages && npm run build --workspace=apps/payments",
    "test:unit": "npm run test --workspaces --if-present",
    "test:integration": "npm run test:integration --workspaces --if-present",
    "test:e2e:dev": "playwright test --config=playwright.dev.config.ts",
    "test:e2e:prod": "playwright test --config=playwright.prod.config.ts",
    "test:e2e:preview": "playwright test --config=playwright.preview.config.ts"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "typescript": "^5.2.0",
    "vitest": "^0.34.0"
  }
}

// Individual app package.json example
// apps/web/package.json
{
  "name": "@odyssey/web",
  "dependencies": {
    "@odyssey/shared": "workspace:*",
    "@odyssey/auth": "workspace:*",
    "@odyssey/ui": "workspace:*",
    "@odyssey/media": "workspace:*",
    "react": "^18.2.0",
    "vite": "^4.4.0"
  },
  "scripts": {
    "build": "vite build",
    "dev": "vite dev",
    "test": "vitest"
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
  },
  "build": {
    "env": {
      "VITE_API_URL": "@vercel-preview-api-url",
      "VITE_PAYMENTS_URL": "@vercel-preview-payments-url"
    }
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
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "CLOUDINARY_URL": "@cloudinary-url"
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
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "env": {
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "STRIPE_WEBHOOK_SECRET": "@stripe-webhook-secret",
    "DATABASE_URL": "@database-url"
  }
}
```

## Environment Variables & Secrets

### 🔒 **Required GitHub Secrets**
```typescript
// Vercel Configuration
VERCEL_TOKEN                 # Vercel deployment token
VERCEL_ORG_ID               # Vercel organization ID
VERCEL_WEB_PROJECT_ID       # Web app project ID
VERCEL_API_PROJECT_ID       # API app project ID
VERCEL_PAYMENTS_PROJECT_ID  # Payments app project ID

// Database & External Services
DATABASE_URL                # Neon PostgreSQL connection string
JWT_SECRET                  # JWT signing secret
CLOUDINARY_URL             # Cloudinary media storage
STRIPE_SECRET_KEY          # Stripe payment processing
STRIPE_WEBHOOK_SECRET      # Stripe webhook validation

// Testing & Monitoring
PLAYWRIGHT_TEST_USER_EMAIL # Test user credentials
PLAYWRIGHT_TEST_USER_PASSWORD
```

### 🌍 **Environment-Specific URLs**
```typescript
// Development/Preview URLs (dynamic)
VITE_API_URL=${VERCEL_PREVIEW_API_URL}
VITE_PAYMENTS_URL=${VERCEL_PREVIEW_PAYMENTS_URL}

// Production URLs (static)
VITE_API_URL=https://odyssey-api-lmcreans-projects.vercel.app
VITE_PAYMENTS_URL=https://odyssey-payments-lmcreans-projects.vercel.app

// Playwright Testing URLs
PLAYWRIGHT_WEB_URL=https://odyssey-web-lmcreans-projects.vercel.app
PLAYWRIGHT_API_URL=https://odyssey-api-lmcreans-projects.vercel.app
PLAYWRIGHT_PAYMENTS_URL=https://odyssey-payments-lmcreans-projects.vercel.app
```

## Testing Integration

### 🧪 **Multi-Environment Testing Strategy**
```typescript
// Playwright configurations for different environments
playwright.dev.config.ts      # Local development testing
playwright.preview.config.ts  # PR preview testing
playwright.prod.config.ts     # Production testing

// Test execution flow
1. Unit Tests (Vitest) → Fast feedback on individual components
2. Integration Tests (Vitest) → Multi-component workflows within apps
3. E2E Tests (Playwright) → Cross-app user journeys
4. Preview Deployment Tests → Validate PR changes
5. Production Tests → Validate live deployment
```

## Deployment Benefits

### ✅ **Advantages of This Strategy**
- **Isolated Deployments**: Each app deploys independently
- **Shared Dependencies**: Packages built once, used by all apps
- **Environment Parity**: Same build process for preview/production
- **Comprehensive Testing**: Multi-layer testing at each stage
- **Fast Feedback**: Preview deployments on every PR
- **Scalable Architecture**: Easy to add new apps/packages
- **Zero Downtime**: Rolling deployments with health checks
- **Cost Efficient**: Only deploy changed apps (future optimization)

### 🚀 **Scaling Considerations**
- **Conditional Deployments**: Deploy only changed apps (future)
- **Dependency Caching**: Cache built packages between deployments
- **Parallel Testing**: Run tests concurrently across environments
- **Blue-Green Deployments**: Zero-downtime production updates (future)
- **Monitoring Integration**: Post-deployment health monitoring (future) 