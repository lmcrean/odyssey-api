# apps/payments - Payment Processing

> **Stripe integration** handling all monetary transactions, revenue sharing, and tax compliance

## Overview
Dedicated payment processing service managing creator monetization, fan payments, subscriptions, and revenue distribution with full tax compliance.

## Tech Stack
- **Node.js** with TypeScript
- **Stripe API** for payment processing
- **Decimal.js** for precise financial calculations
- **Bull** for job queues
- **Vitest** for testing

## File Structure
```typescript
payments/
├── package.json        // Dependencies: stripe, decimal.js, bull
├── vercel.json        // Vercel Functions for webhooks
├── src/
│   ├── index.ts       // Payment service entry point
│   ├── stripe/        // Stripe integration
│   │   ├── client.ts  // Stripe API client configuration
│   │   ├── webhooks/  // Stripe webhook handlers
│   │   │   ├── paymentSucceeded.ts    // Payment success handler
│   │   │   ├── paymentFailed.ts       // Payment failure handler
│   │   │   ├── subscriptionCreated.ts // Subscription creation
│   │   │   ├── subscriptionCanceled.ts // Subscription cancellation
│   │   │   ├── invoicePaid.ts         // Invoice payment
│   │   │   ├── payoutPaid.ts          // Creator payout confirmation
│   │   │   └── __tests__/
│   │   ├── connect/   // Stripe Connect for creators
│   │   │   ├── accountCreation.ts     // Creator account setup
│   │   │   ├── accountVerification.ts // KYC verification
│   │   │   ├── payoutSchedule.ts      // Payout scheduling
│   │   │   └── __tests__/
│   │   └── products/  // Stripe Products & Prices
│   │       ├── subscriptionTiers.ts   // Subscription management
│   │       ├── oneTimePayments.ts     // Sponsorship products
│   │       └── __tests__/
│   ├── services/      // Payment business logic
│   │   ├── PaymentService.ts      // Core payment processing
│   │   ├── SubscriptionService.ts // Subscription management
│   │   ├── PayoutService.ts       // Creator payouts
│   │   ├── TaxService.ts          // Tax calculation & reporting
│   │   ├── RevenueService.ts      // Revenue sharing calculations
│   │   ├── RefundService.ts       // Payment refunds
│   │   └── __tests__/
│   ├── models/        // Payment data models
│   │   ├── Payment.ts             // Payment transaction model
│   │   ├── Subscription.ts        // Subscription model
│   │   ├── Payout.ts             // Creator payout model
│   │   ├── TaxDocument.ts         // Tax document model
│   │   ├── RevenueShare.ts        // Revenue sharing model
│   │   └── __tests__/
│   ├── routes/        // Payment API endpoints
│   │   ├── payments/
│   │   │   ├── createPayment.ts       // POST /payments
│   │   │   ├── getPaymentHistory.ts   // GET /payments/history
│   │   │   ├── refundPayment.ts       // POST /payments/:id/refund
│   │   │   └── __tests__/
│   │   ├── subscriptions/
│   │   │   ├── createSubscription.ts  // POST /subscriptions
│   │   │   ├── cancelSubscription.ts  // DELETE /subscriptions/:id
│   │   │   ├── updateSubscription.ts  // PUT /subscriptions/:id
│   │   │   └── __tests__/
│   │   ├── payouts/
│   │   │   ├── schedulePayout.ts      // POST /payouts
│   │   │   ├── getPayoutHistory.ts    // GET /payouts/history
│   │   │   ├── payoutStatus.ts        // GET /payouts/:id/status
│   │   │   └── __tests__/
│   │   ├── tax/
│   │   │   ├── calculate.ts           // POST /tax/calculate
│   │   │   ├── generate1099.ts        // POST /tax/1099
│   │   │   ├── getVatInfo.ts          // GET /tax/vat
│   │   │   └── __tests__/
│   │   └── webhooks/
│   │       ├── stripe.ts              // POST /webhooks/stripe
│   │       └── __tests__/
│   ├── jobs/          // Background payment jobs
│   │   ├── payoutProcessing.ts        // Process creator payouts
│   │   ├── subscriptionBilling.ts     // Handle recurring billing
│   │   ├── taxCalculation.ts          // Calculate taxes
│   │   ├── revenueDistribution.ts     // Distribute revenue shares
│   │   ├── failedPaymentRetry.ts      // Retry failed payments
│   │   └── __tests__/
│   ├── utils/
│   │   ├── calculations/
│   │   │   ├── revenueSharing.ts      // Revenue split calculations
│   │   │   ├── taxCalculations.ts     // Tax calculations
│   │   │   ├── feeCalculations.ts     // Platform fee calculations
│   │   │   ├── currencyConversion.ts  // Currency conversion
│   │   │   └── __tests__/
│   │   ├── validation/
│   │   │   ├── paymentValidation.ts   // Payment data validation
│   │   │   ├── subscriptionValidation.ts // Subscription validation
│   │   │   ├── taxValidation.ts       // Tax information validation
│   │   │   └── __tests__/
│   │   ├── formatting/
│   │   │   ├── currencyFormatting.ts  // Currency display formatting
│   │   │   ├── receiptFormatting.ts   // Receipt generation
│   │   │   ├── invoiceFormatting.ts   // Invoice generation
│   │   │   └── __tests__/
│   │   └── security/
│   │       ├── webhookVerification.ts // Stripe webhook verification
│   │       ├── paymentEncryption.ts   // Sensitive data encryption
│   │       └── __tests__/
│   └── types/         // Payment TypeScript types
│       ├── Payment.ts             // Payment transaction types
│       ├── Subscription.ts        // Subscription types
│       ├── Payout.ts             // Payout types
│       ├── Tax.ts                // Tax information types
│       ├── Stripe.ts             // Stripe-specific types
│       └── index.ts
└── tax-forms/         // Tax document generation
    ├── generators/
    │   ├── 1099Generator.ts       // US 1099 form generation
    │   ├── VATGenerator.ts        // EU VAT form generation
    │   ├── TaxSummaryGenerator.ts // Tax summary reports
    │   └── __tests__/
    ├── templates/
    │   ├── 1099Template.ts        // 1099 form template
    │   ├── VATTemplate.ts         // VAT form template
    │   └── summaryTemplate.ts     // Summary template
    └── validation/
        ├── taxFormValidation.ts   // Tax form validation
        └── __tests__/
```

## Key Features

### Payment Processing
- **Stripe Integration**: Full Stripe API integration for payments
- **Multiple Payment Methods**: Credit cards, digital wallets, bank transfers
- **Currency Support**: Multi-currency with automatic conversion
- **Fraud Protection**: Advanced fraud detection and prevention
- **PCI Compliance**: Secure payment processing

### Creator Monetization
- **Stripe Connect**: Creator payment accounts
- **Revenue Sharing**: Configurable platform commission
- **Instant Payouts**: Real-time creator payouts
- **Subscription Tiers**: Multiple subscription levels
- **One-time Sponsorships**: Direct creator support

### Tax Compliance
- **1099 Generation**: Automatic US tax form generation
- **EU VAT Handling**: VAT calculation and reporting
- **International Tax**: Multi-country tax compliance
- **Tax Reporting**: Comprehensive tax reporting tools
- **Audit Trail**: Complete transaction audit trail

### Subscription Management
- **Recurring Billing**: Automated subscription billing
- **Tier Management**: Multiple subscription tiers
- **Proration**: Automatic proration for upgrades/downgrades
- **Cancellation**: Flexible cancellation policies
- **Dunning Management**: Failed payment handling

## Revenue Model Configuration
```typescript
// Revenue sharing configuration
const REVENUE_SHARING = {
  PLATFORM_COMMISSION: 0.05, // 5% platform fee
  PAYMENT_PROCESSING: 0.029, // 2.9% + 30¢ Stripe fee
  CREATOR_SHARE: 0.921, // ~92.1% to creator
  MINIMUM_PAYOUT: 25.00, // $25 minimum payout
  PAYOUT_SCHEDULE: 'weekly' // Weekly payouts
};

// Subscription tiers
const SUBSCRIPTION_TIERS = {
  BASIC: { price: 4.99, features: ['ad-free', 'early-access'] },
  PREMIUM: { price: 9.99, features: ['ad-free', 'early-access', 'exclusive-content'] },
  VIP: { price: 19.99, features: ['ad-free', 'early-access', 'exclusive-content', '1-on-1'] }
};
```

## Environment Variables
```typescript
// .env
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CONNECT_CLIENT_ID="ca_..."
TAX_SERVICE_API_KEY="..."
REDIS_URL="redis://..."
DATABASE_URL="postgresql://..."
```

## Webhook Endpoints
```typescript
// Stripe webhook events
POST /webhooks/stripe
- payment_intent.succeeded
- payment_intent.payment_failed
- customer.subscription.created
- customer.subscription.deleted
- invoice.payment_succeeded
- payout.paid
- account.updated
```

## Deployment
- **Vercel Functions**: Serverless payment processing
- **Webhook Security**: Stripe signature verification
- **Job Queues**: Redis-based background processing
- **Monitoring**: Payment transaction monitoring 