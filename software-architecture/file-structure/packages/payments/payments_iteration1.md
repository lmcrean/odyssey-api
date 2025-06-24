# packages/payments - Payment Utilities & Validation

> **Basic payment processing** for simple monetization

## Overview
Basic payment utilities package providing essential payment processing, validation, and revenue calculations for creator monetization. Focused on core Stripe integration and simple payment flows for MVP.

## Tech Stack
- **Stripe** for payment processing
- **decimal.js** for precise financial calculations
- **currency.js** for currency handling
- **validator** for payment validation
- **TypeScript** for type safety

## File Structure
```typescript
payments/
├── package.json       // Dependencies: stripe, decimal.js, currency.js
├── src/
│   ├── validation/   // Payment validation utilities
│   │   ├── cards/
│   │   │   ├── credit-card.ts         // Credit card validation
│   │   │   ├── luhn.ts                // Luhn algorithm implementation
│   │   │   ├── cvv.ts                 // CVV validation
│   │   │   └── __tests__/
│   │   ├── amounts/
│   │   │   ├── currency.ts            // Currency amount validation
│   │   │   ├── limits.ts              // Payment limit validation
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── schemas.ts             // Validation schemas
│   │       └── __tests__/
│   ├── calculations/ // Financial calculations
│   │   ├── revenue/
│   │   │   ├── sharing.ts             // Revenue sharing calculations
│   │   │   ├── commission.ts          // Commission calculations
│   │   │   └── __tests__/
│   │   ├── fees/
│   │   │   ├── platform.ts            // Platform fee calculations
│   │   │   ├── stripe.ts              // Stripe fee calculations
│   │   │   └── __tests__/
│   │   ├── subscriptions/
│   │   │   ├── billing-cycles.ts      // Billing cycle calculations
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── precision.ts           // High-precision arithmetic
│   │       ├── rounding.ts            // Rounding utilities
│   │       └── __tests__/
│   ├── formatting/   // Payment formatting utilities
│   │   ├── currency/
│   │   │   ├── display.ts             // Currency display formatting
│   │   │   ├── symbols.ts             // Currency symbol management
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── templates.ts           // Template utilities
│   │       └── __tests__/
│   ├── integrations/ // Payment gateway integrations
│   │   ├── stripe/
│   │   │   ├── client.ts              // Stripe client configuration
│   │   │   ├── payments.ts            // Payment processing
│   │   │   ├── subscriptions.ts       // Subscription management
│   │   │   ├── webhooks.ts            // Webhook handling
│   │   │   ├── refunds.ts             // Refund processing
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── factory.ts             // Payment provider factory
│   │       └── __tests__/
│   ├── types/        // Payment type definitions
│   │   ├── Payment.ts                 // Core payment types
│   │   ├── Subscription.ts            // Subscription types
│   │   ├── Payout.ts                  // Creator payout types
│   │   └── index.ts
│   ├── constants/    // Payment constants
│   │   ├── currencies.ts              // Supported currencies
│   │   ├── fees.ts                    // Fee structures
│   │   ├── limits.ts                  // Payment limits
│   │   └── index.ts
│   └── utils/        // Payment utilities
│       ├── helpers.ts                 // Payment helper functions
│       ├── converters.ts              // Data conversion utilities
│       ├── validators.ts              // Validation utilities
│       └── __tests__/
└── docs/
    ├── README.md                      // Package overview
    ├── payment-processing.md          // Payment processing guide
    └── revenue-sharing.md             // Revenue sharing guide
```

## Key Features

### Payment Validation
- **Card Validation**: Credit card validation with Luhn algorithm
- **Amount Validation**: Currency-aware amount validation
- **Input Sanitization**: Basic data sanitization

### Financial Calculations
- **Revenue Sharing**: Simple revenue sharing with creator-platform splits
- **Fee Calculations**: Platform fees and Stripe processing fees
- **Subscription Math**: Basic billing cycles
- **High Precision**: Decimal.js for accurate financial arithmetic

### Payment Processing
- **Stripe Integration**: Primary payment gateway
- **Subscription Management**: Basic recurring billing
- **Refund Processing**: Simple refunds

## Usage Examples

### Payment Validation
```typescript
import { CardValidator, AmountValidator } from '@packages/payments/validation';

// Validate credit card
const cardValidation = CardValidator.validate({
  number: '4242424242424242',
  expiry: '12/25',
  cvv: '123',
  name: 'John Doe'
});

if (cardValidation.isValid) {
  console.log('Card type:', cardValidation.cardType); // 'visa'
  console.log('Last 4 digits:', cardValidation.last4); // '4242'
}

// Validate payment amount
const amountValidation = AmountValidator.validate({
  amount: 29.99,
  currency: 'USD',
  minAmount: 1.00,
  maxAmount: 10000.00
});
```

### Revenue Sharing Calculations
```typescript
import { RevenueCalculator } from '@packages/payments/calculations';

const calculator = new RevenueCalculator();

// Calculate revenue split
const revenueSplit = calculator.calculateRevenueSplit({
  grossAmount: 100.00,
  currency: 'USD',
  platformFeePercent: 10, // 10% platform fee
  paymentMethod: 'card'
});

console.log('Creator earnings:', revenueSplit.creatorAmount); // $87.11
console.log('Platform fee:', revenueSplit.platformFee); // $10.00
console.log('Processing fee:', revenueSplit.processingFee); // $2.89
```

### Stripe Integration
```typescript
import { StripeIntegration } from '@packages/payments/integrations';

const stripe = new StripeIntegration({
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
});

// Process payment
const payment = await stripe.processPayment({
  amount: 2999, // $29.99
  currency: 'usd',
  paymentMethod: 'pm_1234567890',
  metadata: {
    creatorId: 'creator_123',
    contentId: 'content_456'
  }
});
```

## Configuration

### Environment Variables
```typescript
// Stripe configuration
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

// Payment settings
PLATFORM_FEE_PERCENT="10"
MINIMUM_PAYMENT_AMOUNT="1.00"
MAXIMUM_PAYMENT_AMOUNT="10000.00"
```

## Dependencies
- **Stripe**: ^12.18.0 - Payment processing platform
- **decimal.js**: ^10.4.0 - Precise decimal arithmetic
- **currency.js**: ^2.0.0 - Currency handling and formatting
- **validator**: ^13.11.0 - Input validation utilities 