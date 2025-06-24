# apps/payments - Payment Processing (MVP)

> **Basic Stripe integration** for creator tips and simple subscriptions

## MVP Focus 
**Essential for 100-500 creators launch:**
- Basic payment processing (tips/sponsorships)
- Simple creator payouts 
- Single subscription tier
- Essential webhooks
- Basic Stripe Connect for creators

## Tech Stack
- **Node.js** with TypeScript
- **Stripe API** for payment processing
- **Vitest** for testing

## File Structure
```typescript
payments/
├── package.json        // Dependencies: stripe
├── vercel.json        // Vercel Functions for webhooks
├── src/
│   ├── index.ts       // Payment service entry point
│   ├── stripe/        // Basic Stripe integration
│   │   ├── client.ts  // Stripe API client configuration
│   │   ├── webhooks/  // Essential webhook handlers
│   │   │   ├── paymentSucceeded.ts    // Payment success handler
│   │   │   ├── paymentFailed.ts       // Payment failure handler
│   │   │   ├── subscriptionCreated.ts // Basic subscription creation
│   │   │   └── __tests__/
│   │   ├── connect/   // Basic Stripe Connect for creators
│   │   │   ├── accountCreation.ts     // Creator account setup
│   │   │   ├── payoutSchedule.ts      // Simple weekly payouts
│   │   │   └── __tests__/
│   │   └── products/  // Simple Stripe Products
│   │       ├── subscriptionTier.ts    // Single $5/month tier
│   │       ├── tipPayments.ts         // One-time tip products
│   │       └── __tests__/
│   ├── services/      // Core payment business logic
│   │   ├── PaymentService.ts      // Basic payment processing
│   │   ├── SubscriptionService.ts // Simple subscription management
│   │   ├── PayoutService.ts       // Basic creator payouts
│   │   └── __tests__/
│   ├── models/        // Essential payment data models
│   │   ├── Payment.ts             // Payment transaction model
│   │   ├── Subscription.ts        // Basic subscription model
│   │   ├── Payout.ts             // Creator payout model
│   │   └── __tests__/
│   ├── routes/        // Essential payment API endpoints
│   │   ├── payments/
│   │   │   ├── createPayment.ts       // POST /payments (tips/sponsorships)
│   │   │   ├── getPaymentHistory.ts   // GET /payments/history
│   │   │   └── __tests__/
│   │   ├── subscriptions/
│   │   │   ├── createSubscription.ts  // POST /subscriptions
│   │   │   ├── cancelSubscription.ts  // DELETE /subscriptions/:id
│   │   │   └── __tests__/
│   │   ├── payouts/
│   │   │   ├── getPayoutHistory.ts    // GET /payouts/history
│   │   │   ├── payoutStatus.ts        // GET /payouts/:id/status
│   │   │   └── __tests__/
│   │   └── webhooks/
│   │       ├── stripe.ts              // POST /webhooks/stripe
│   │       └── __tests__/
│   ├── utils/
│   │   ├── calculations/
│   │   │   ├── revenueSharing.ts      // Simple 5% platform fee
│   │   │   ├── feeCalculations.ts     // Basic Stripe fee calculations
│   │   │   └── __tests__/
│   │   ├── validation/
│   │   │   ├── paymentValidation.ts   // Basic payment validation
│   │   │   └── __tests__/
│   │   └── security/
│   │       ├── webhookVerification.ts // Stripe webhook verification
│   │       └── __tests__/
│   └── types/         // Essential payment TypeScript types
│       ├── Payment.ts             // Payment transaction types
│       ├── Subscription.ts        // Basic subscription types
│       ├── Payout.ts             // Payout types
│       ├── Stripe.ts             // Stripe-specific types
│       └── index.ts
```

## MVP Features

### Basic Payment Processing
- **Stripe Integration**: Essential Stripe API integration
- **Payment Methods**: Credit cards only (primary payment method)
- **Currency Support**: USD only for MVP
- **Basic Security**: Essential fraud protection

### Creator Monetization
- **Stripe Connect**: Basic creator payment accounts
- **Revenue Sharing**: Simple 5% platform commission
- **Weekly Payouts**: Automated weekly creator payouts
- **Single Subscription**: $5/month supporter tier
- **Tips/Sponsorships**: One-time creator support ($1-$100)

### Essential Webhooks
- **Payment Success**: Handle successful payments
- **Payment Failure**: Handle failed payments
- **Subscription Events**: Basic subscription lifecycle
- **Payout Events**: Track creator payouts

## MVP Revenue Model
```typescript
// Simple revenue sharing for MVP
const MVP_REVENUE_SHARING = {
  PLATFORM_COMMISSION: 0.05, // 5% platform fee
  PAYMENT_PROCESSING: 0.029, // 2.9% + 30¢ Stripe fee
  CREATOR_SHARE: 0.921, // ~92.1% to creator
  MINIMUM_PAYOUT: 25.00, // $25 minimum payout
  PAYOUT_SCHEDULE: 'weekly' // Weekly payouts
};

// Single subscription tier for MVP
const MVP_SUBSCRIPTION = {
  SUPPORTER: { 
    price: 5.00, 
    features: ['ad-free', 'supporter-badge', 'priority-comments']
  }
};

// Tip amounts for MVP
const TIP_AMOUNTS = [1, 3, 5, 10, 25, 50, 100]; // USD
```

## Environment Variables
```typescript
// .env
STRIPE_SECRET_KEY="sk_test_..." // Test key for MVP
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CONNECT_CLIENT_ID="ca_..."
DATABASE_URL="postgresql://..." // Or SQLite for MVP
```

## Essential Webhook Events
```typescript
// MVP Stripe webhook events
POST /webhooks/stripe
- payment_intent.succeeded     Essential
- payment_intent.payment_failed  Essential  
- customer.subscription.created  Essential
- customer.subscription.deleted  Essential
- payout.paid  Essential
```

## MVP Success Metrics
- **$2K+ Monthly GMV** in creator earnings
- **95%+ Payment Success** rate
- **<3 second** payment processing time
- **25+ Active Creators** receiving payments
- **100+ Successful** subscriber signups

## Deployment
- **Vercel Functions**: Serverless payment processing
- **Webhook Security**: Stripe signature verification
- **SQLite Database**: Simple transaction storage
- **Basic Monitoring**: Console logging + Stripe dashboard

## Post-MVP Migration Path
- Month 3: Add multiple subscription tiers → `payments_i2.md`
- Month 6: Add tax compliance → `payments_i2.md`
- Month 12: Add international currencies → `payments_i2.md` 