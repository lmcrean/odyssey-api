# packages/payments - Payment Utilities & Validation

> **Payment processing utilities** shared between payment services

## Overview
Comprehensive payment utilities package providing validation, calculations, formatting, and integration tools for the creator monetization platform. Handles revenue sharing, tax compliance, multi-currency support, and GDPR-compliant payment processing.

## Tech Stack
- **Stripe** for payment processing
- **decimal.js** for precise financial calculations
- **currency.js** for currency handling
- **validator** for payment validation
- **moment** for date handling
- **TypeScript** for type safety

## File Structure
```typescript
payments/
├── package.json       // Dependencies: stripe, decimal.js, currency.js
├── src/
│   ├── validation/   // Payment validation utilities
│   │   ├── cards/
│   │   │   ├── credit-card.ts         // Credit card validation
│   │   │   ├── debit-card.ts          // Debit card validation
│   │   │   ├── luhn.ts                // Luhn algorithm implementation
│   │   │   ├── cvv.ts                 // CVV validation
│   │   │   ├── expiry.ts              // Expiry date validation
│   │   │   └── __tests__/
│   │   ├── amounts/
│   │   │   ├── currency.ts            // Currency amount validation
│   │   │   ├── precision.ts           // Decimal precision validation
│   │   │   ├── limits.ts              // Payment limit validation
│   │   │   └── __tests__/
│   │   ├── accounts/
│   │   │   ├── iban.ts                // IBAN validation
│   │   │   ├── aba.ts                 // ABA routing number validation
│   │   │   ├── sort-code.ts           // Sort code validation (UK)
│   │   │   └── __tests__/
│   │   ├── tax/
│   │   │   ├── vat-id.ts              // VAT ID validation
│   │   │   ├── tax-id.ts              // Tax ID validation
│   │   │   ├── ssn.ts                 // SSN validation (US)
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── schemas.ts             // Validation schemas
│   │       ├── sanitization.ts        // Payment data sanitization
│   │       └── __tests__/
│   ├── calculations/ // Financial calculations
│   │   ├── revenue/
│   │   │   ├── sharing.ts             // Revenue sharing calculations
│   │   │   ├── commission.ts          // Commission calculations
│   │   │   ├── tiers.ts               // Tier-based revenue sharing
│   │   │   └── __tests__/
│   │   ├── fees/
│   │   │   ├── platform.ts            // Platform fee calculations
│   │   │   ├── processing.ts          // Payment processing fees
│   │   │   ├── stripe.ts              // Stripe fee calculations
│   │   │   └── __tests__/
│   │   ├── taxes/
│   │   │   ├── income.ts              // Income tax calculations
│   │   │   ├── vat.ts                 // VAT calculations
│   │   │   ├── sales.ts               // Sales tax calculations
│   │   │   └── __tests__/
│   │   ├── subscriptions/
│   │   │   ├── prorating.ts           // Subscription prorating
│   │   │   ├── billing-cycles.ts      // Billing cycle calculations
│   │   │   ├── discounts.ts           // Discount calculations
│   │   │   └── __tests__/
│   │   ├── currency/
│   │   │   ├── conversion.ts          // Currency conversion calculations
│   │   │   ├── rates.ts               // Exchange rate management
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── precision.ts           // High-precision arithmetic
│   │       ├── rounding.ts            // Rounding utilities
│   │       └── __tests__/
│   ├── formatting/   // Payment formatting utilities
│   │   ├── currency/
│   │   │   ├── display.ts             // Currency display formatting
│   │   │   ├── symbols.ts             // Currency symbol management
│   │   │   ├── localization.ts        // Localized currency formatting
│   │   │   └── __tests__/
│   │   ├── receipts/
│   │   │   ├── templates.ts           // Receipt templates
│   │   │   ├── pdf.ts                 // PDF receipt generation
│   │   │   ├── email.ts               // Email receipt formatting
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── localization.ts        // Payment localization utilities
│   │       ├── templates.ts           // Template utilities
│   │       └── __tests__/
│   ├── integrations/ // Payment gateway integrations
│   │   ├── stripe/
│   │   │   ├── client.ts              // Stripe client configuration
│   │   │   ├── payments.ts            // Payment processing
│   │   │   ├── subscriptions.ts       // Subscription management
│   │   │   ├── connect.ts             // Stripe Connect integration
│   │   │   ├── webhooks.ts            // Webhook handling
│   │   │   ├── refunds.ts             // Refund processing
│   │   │   └── __tests__/
│   │   ├── paypal/
│   │   │   ├── client.ts              // PayPal client configuration
│   │   │   ├── payments.ts            // PayPal payment processing
│   │   │   ├── subscriptions.ts       // PayPal subscription management
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── factory.ts             // Payment provider factory
│   │       ├── switching.ts           // Provider switching logic
│   │       └── __tests__/
│   ├── compliance/   // Payment compliance utilities
│   │   ├── pci/
│   │   │   ├── tokenization.ts        // PCI-compliant tokenization
│   │   │   ├── encryption.ts          // PCI data encryption
│   │   │   ├── logging.ts             // PCI-compliant logging
│   │   │   └── __tests__/
│   │   ├── tax-reporting/
│   │   │   ├── 1099-k.ts              // 1099-K form generation
│   │   │   ├── vat-moss.ts            // VAT MOSS reporting
│   │   │   └── __tests__/
│   │   ├── gdpr/
│   │   │   ├── data-processing.ts     // GDPR payment data processing
│   │   │   ├── consent.ts             // Payment consent management
│   │   │   ├── deletion.ts            // Payment data deletion
│   │   │   └── __tests__/
│   │   └── regional/
│   │       ├── psd2.ts                // PSD2 compliance (EU)
│   │       ├── open-banking.ts        // Open Banking compliance (UK)
│   │       └── __tests__/
│   ├── fraud/        // Fraud detection utilities
│   │   ├── detection/
│   │   │   ├── velocity.ts            // Velocity checking
│   │   │   ├── pattern.ts             // Pattern analysis
│   │   │   ├── device.ts              // Device fingerprinting
│   │   │   └── __tests__/
│   │   ├── risk-scoring/
│   │   │   ├── models.ts              // Risk scoring models
│   │   │   ├── rules-engine.ts        // Rules-based scoring
│   │   │   └── __tests__/
│   │   └── prevention/
│   │       ├── blocking.ts            // Transaction blocking
│   │       ├── quarantine.ts          // Payment quarantine
│   │       └── __tests__/
│   ├── analytics/    // Payment analytics
│   │   ├── revenue/
│   │   │   ├── tracking.ts            // Revenue tracking
│   │   │   ├── forecasting.ts         // Revenue forecasting
│   │   │   ├── trends.ts              // Revenue trend analysis
│   │   │   └── __tests__/
│   │   ├── performance/
│   │   │   ├── success-rates.ts       // Payment success rate analysis
│   │   │   ├── failure-analysis.ts    // Payment failure analysis
│   │   │   └── __tests__/
│   │   └── customer/
│   │       ├── lifetime-value.ts      // Customer lifetime value
│   │       ├── churn-analysis.ts      // Payment churn analysis
│   │       └── __tests__/
│   ├── types/        // Payment type definitions
│   │   ├── Payment.ts                 // Core payment types
│   │   ├── Subscription.ts            // Subscription types
│   │   ├── Payout.ts                  // Creator payout types
│   │   ├── TaxInfo.ts                 // Tax information types
│   │   ├── Fraud.ts                   // Fraud detection types
│   │   ├── Analytics.ts               // Payment analytics types
│   │   ├── Compliance.ts              // Compliance types
│   │   └── index.ts
│   ├── constants/    // Payment constants
│   │   ├── currencies.ts              // Supported currencies
│   │   ├── countries.ts               // Country-specific payment rules
│   │   ├── fees.ts                    // Fee structures
│   │   ├── limits.ts                  // Payment limits
│   │   └── index.ts
│   └── utils/        // Payment utilities
│       ├── helpers.ts                 // Payment helper functions
│       ├── converters.ts              // Data conversion utilities
│       ├── validators.ts              // Validation utilities
│       ├── formatters.ts              // Formatting utilities
│       └── __tests__/
└── docs/
    ├── README.md                      // Package overview
    ├── payment-processing.md          // Payment processing guide
    ├── revenue-sharing.md             // Revenue sharing guide
    ├── tax-compliance.md              // Tax compliance guide
    └── fraud-prevention.md            // Fraud prevention guide
```

## Key Features

### Payment Validation
- **Card Validation**: Comprehensive credit/debit card validation with Luhn algorithm
- **Amount Validation**: Currency-aware amount validation with precision handling
- **Account Validation**: IBAN, ABA, and sort code validation
- **Tax ID Validation**: VAT ID, SSN, and international tax ID validation
- **Input Sanitization**: PCI-compliant data sanitization and normalization

### Financial Calculations
- **Revenue Sharing**: Multi-tier revenue sharing with creator-platform splits
- **Fee Calculations**: Platform fees, processing fees, and international charges
- **Tax Calculations**: Income tax, VAT, and sales tax calculations
- **Subscription Math**: Prorating, billing cycles, and discounts
- **Currency Conversion**: Real-time exchange rates with hedging support
- **High Precision**: Decimal.js for accurate financial arithmetic

### Payment Processing
- **Multi-Gateway Support**: Stripe, PayPal integration
- **Stripe Connect**: Creator payout management and marketplace functionality
- **Subscription Management**: Recurring billing with flexible cycles
- **Refund Processing**: Partial and full refunds with fee handling
- **Payment Retry**: Smart retry logic for failed payments

### Compliance & Security
- **PCI Compliance**: PCI DSS Level 1 compliant data handling
- **Tax Reporting**: Automated 1099-K, VAT MOSS, and international tax reporting
- **GDPR Compliance**: Privacy-compliant payment data processing
- **Regional Compliance**: PSD2, Open Banking compliance

### Fraud Prevention
- **Real-time Detection**: Velocity checking and pattern analysis
- **Risk Scoring**: Rules-based fraud scoring
- **Device Fingerprinting**: Advanced device identification
- **Prevention Tools**: Transaction blocking and quarantine

## Usage Examples

### Payment Validation
```typescript
import { 
  CardValidator, 
  AmountValidator, 
  TaxIdValidator 
} from '@packages/payments/validation';

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
  creatorTier: 'premium', // 85% split
  paymentMethod: 'card',
  isInternational: false
});

console.log('Creator earnings:', revenueSplit.creatorAmount); // $81.77
console.log('Platform fee:', revenueSplit.platformFee); // $15.00
console.log('Processing fee:', revenueSplit.processingFee); // $3.23
console.log('Net to creator:', revenueSplit.netAmount); // $81.77
```

### Stripe Integration
```typescript
import { StripeIntegration } from '@packages/payments/integrations';

const stripe = new StripeIntegration({
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  connectMode: true
});

// Process payment with creator split
const payment = await stripe.processPayment({
  amount: 2999, // $29.99
  currency: 'usd',
  paymentMethod: 'pm_1234567890',
  creatorAccountId: 'acct_creator123',
  applicationFee: 450, // $4.50 platform fee
  metadata: {
    creatorId: 'creator_123',
    contentId: 'content_456',
    subscriptionId: 'sub_789'
  }
});
```

### Tax Compliance
```typescript
import { TaxCalculator, TaxReporting } from '@packages/payments/compliance';

const taxCalculator = new TaxCalculator();
const taxReporting = new TaxReporting();

// Calculate taxes for creator earnings
const taxCalculation = await taxCalculator.calculateTaxes({
  creatorId: 'creator_123',
  earnings: 50000.00,
  currency: 'USD',
  taxYear: 2024,
  jurisdiction: 'US',
  state: 'CA',
  creatorType: 'individual'
});

// Generate 1099-K form
const tax1099K = await taxReporting.generate1099K({
  creatorId: 'creator_123',
  taxYear: 2024,
  grossPayments: 75000.00,
  transactionCount: 1250
});
```

### Fraud Detection
```typescript
import { FraudDetector } from '@packages/payments/fraud';

const fraudDetector = new FraudDetector();

// Analyze payment for fraud
const fraudAnalysis = await fraudDetector.analyzePayment({
  paymentId: 'payment_123',
  amount: 999.99,
  currency: 'USD',
  paymentMethod: 'card',
  customerInfo: {
    id: 'customer_456',
    email: 'user@example.com',
    ipAddress: '192.168.1.1'
  },
  velocityChecks: true,
  deviceAnalysis: true
});

if (fraudAnalysis.riskScore > 0.8) {
  // High risk - require additional verification
  await fraudDetector.requireVerification({
    paymentId: 'payment_123',
    verificationType: '3ds' // 3D Secure
  });
} else if (fraudAnalysis.riskScore > 0.5) {
  // Medium risk - monitor transaction
  await fraudDetector.monitorTransaction('payment_123');
}
```

## Dependencies
- **Stripe**: ^12.18.0 - Payment processing platform
- **decimal.js**: ^10.4.0 - Precise decimal arithmetic
- **currency.js**: ^2.0.0 - Currency handling and formatting
- **validator**: ^13.11.0 - Input validation utilities
- **moment**: ^2.29.0 - Date and time manipulation
- **country-list**: ^2.2.0 - Country and currency data 