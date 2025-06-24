# packages/observability - Monitoring & Analytics

> **Comprehensive monitoring** with logging, metrics, and creator analytics

## Overview
Complete observability package providing structured logging, metrics collection, distributed tracing, and creator-focused analytics for the monetization platform. Includes business intelligence, performance monitoring, and GDPR-compliant data collection.

## Tech Stack
- **Winston** for structured logging
- **Prometheus** for metrics collection
- **OpenTelemetry** for distributed tracing
- **Mixpanel** for user analytics
- **Grafana** for visualization
- **DataDog** for APM
- **TypeScript** for type safety

## File Structure
```typescript
observability/
├── package.json       // Dependencies: winston, prometheus, opentelemetry
├── src/
│   ├── logging/      // Structured logging system
│   │   ├── winston/
│   │   │   ├── config.ts              // Winston configuration
│   │   │   ├── transports.ts          // Log transports (file, console, remote)
│   │   │   ├── formatting.ts          // Log formatting and structure
│   │   │   ├── rotation.ts            // Log rotation management
│   │   │   └── __tests__/
│   │   ├── structured/
│   │   │   ├── logger.ts              // Structured logger implementation
│   │   │   ├── context.ts             // Request context logging
│   │   │   ├── correlation.ts         // Correlation ID management
│   │   │   ├── enrichment.ts          // Log enrichment utilities
│   │   │   └── __tests__/
│   │   ├── gdpr/
│   │   │   ├── compliance.ts          // GDPR-compliant logging
│   │   │   ├── sanitization.ts        // PII sanitization
│   │   │   ├── retention.ts           // Log retention policies
│   │   │   ├── anonymization.ts       // Data anonymization
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── filters.ts             // Log filtering utilities
│   │       ├── sampling.ts            // Log sampling strategies
│   │       ├── buffering.ts           // Log buffering
│   │       └── __tests__/
│   ├── metrics/      // Application metrics
│   │   ├── prometheus/
│   │   │   ├── registry.ts            // Prometheus registry setup
│   │   │   ├── collectors.ts          // Custom metric collectors
│   │   │   ├── middleware.ts          // Express middleware
│   │   │   ├── pushgateway.ts         // Push gateway integration
│   │   │   └── __tests__/
│   │   ├── business/
│   │   │   ├── revenue.ts             // Revenue metrics
│   │   │   ├── subscriptions.ts       // Subscription metrics
│   │   │   ├── content.ts             // Content metrics
│   │   │   ├── creators.ts            // Creator metrics
│   │   │   ├── engagement.ts          // Engagement metrics
│   │   │   └── __tests__/
│   │   ├── technical/
│   │   │   ├── performance.ts         // Performance metrics
│   │   │   ├── errors.ts              // Error rate metrics
│   │   │   ├── availability.ts        // Uptime metrics
│   │   │   ├── resources.ts           // Resource usage metrics
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── labels.ts              // Metric labeling utilities
│   │       ├── aggregation.ts         // Metric aggregation
│   │       ├── export.ts              // Metric export utilities
│   │       └── __tests__/
│   ├── tracing/      // Distributed tracing
│   │   ├── opentelemetry/
│   │   │   ├── config.ts              // OpenTelemetry configuration
│   │   │   ├── instrumentation.ts     // Auto-instrumentation setup
│   │   │   ├── exporters.ts           // Trace exporters (Jaeger, Zipkin)
│   │   │   ├── sampling.ts            // Trace sampling strategies
│   │   │   └── __tests__/
│   │   ├── spans/
│   │   │   ├── database.ts            // Database operation tracing
│   │   │   ├── http.ts                // HTTP request tracing
│   │   │   ├── cache.ts               // Cache operation tracing
│   │   │   ├── queue.ts               // Queue operation tracing
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── attributes.ts          // Span attributes utilities
│   │       ├── events.ts              // Span events utilities
│   │       ├── errors.ts              // Error span utilities
│   │       └── __tests__/
│   ├── analytics/    // Business analytics
│   │   ├── creators/
│   │   │   ├── performance.ts         // Creator performance analytics
│   │   │   ├── earnings.ts            // Creator earnings analytics
│   │   │   ├── growth.ts              // Creator growth analytics
│   │   │   ├── retention.ts           // Creator retention analytics
│   │   │   ├── engagement.ts          // Creator engagement analytics
│   │   │   └── __tests__/
│   │   ├── content/
│   │   │   ├── views.ts               // Content view analytics
│   │   │   ├── engagement.ts          // Content engagement analytics
│   │   │   ├── monetization.ts        // Content monetization analytics
│   │   │   ├── trending.ts            // Trending content analytics
│   │   │   ├── lifecycle.ts           // Content lifecycle analytics
│   │   │   └── __tests__/
│   │   ├── revenue/
│   │   │   ├── subscriptions.ts       // Subscription revenue analytics
│   │   │   ├── transactions.ts        // Transaction analytics
│   │   │   ├── fees.ts                // Platform fee analytics
│   │   │   ├── payouts.ts             // Creator payout analytics
│   │   │   ├── forecasting.ts         // Revenue forecasting
│   │   │   └── __tests__/
│   │   └── gdpr/
│   │       ├── compliance.ts          // GDPR-compliant analytics
│   │       ├── consent.ts             // Consent tracking
│   │       ├── anonymization.ts       // Data anonymization
│   │       ├── retention.ts           // Data retention policies
│   │       └── __tests__/
│   ├── dashboards/   // Monitoring dashboards
│   │   ├── grafana/
│   │   │   ├── provisioning/
│   │   │   │   ├── datasources.yml    // Grafana datasource config
│   │   │   │   └── dashboards.yml     // Dashboard provisioning
│   │   │   ├── dashboards/
│   │   │   │   ├── platform-overview.json // Platform overview dashboard
│   │   │   │   ├── creator-analytics.json // Creator analytics dashboard
│   │   │   │   ├── revenue-metrics.json   // Revenue metrics dashboard
│   │   │   │   └── technical-metrics.json // Technical metrics dashboard
│   │   │   └── alerts/
│   │   │       ├── error-rates.yml     // Error rate alerts
│   │   │       ├── performance.yml     // Performance alerts
│   │   │       ├── revenue.yml         // Revenue alerts
│   │   │       └── security.yml        // Security alerts
│   │   └── custom/
│   │       ├── components/
│   │       │   ├── MetricCard.tsx      // Metric display component
│   │       │   ├── ChartContainer.tsx  // Chart wrapper component
│   │       │   └── DataTable.tsx       // Data table component
│   │       └── utils/
│   │           ├── charts.ts           // Chart utilities
│   │           ├── formatting.ts       // Data formatting
│   │           └── colors.ts           // Color schemes
│   ├── alerts/       // Alerting system
│   │   ├── rules/
│   │   │   ├── error-rates.ts          // Error rate alert rules
│   │   │   ├── performance.ts          // Performance alert rules
│   │   │   ├── revenue.ts              // Revenue alert rules
│   │   │   ├── security.ts             // Security alert rules
│   │   │   └── __tests__/
│   │   ├── channels/
│   │   │   ├── email.ts                // Email alert channel
│   │   │   ├── slack.ts                // Slack alert channel
│   │   │   ├── webhook.ts              // Webhook alert channel
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── formatting.ts           // Alert formatting
│   │       ├── throttling.ts           // Alert throttling
│   │       ├── deduplication.ts        // Alert deduplication
│   │       └── __tests__/
│   ├── types/        // Observability types
│   │   ├── Logging.ts                  // Logging type definitions
│   │   ├── Metrics.ts                  // Metrics type definitions
│   │   ├── Tracing.ts                  // Tracing type definitions
│   │   ├── Analytics.ts                // Analytics type definitions
│   │   └── index.ts
│   └── utils/        // Observability utilities
│       ├── sampling.ts                 // Sampling utilities
│       ├── batching.ts                 // Batching utilities
│       ├── compression.ts              // Data compression
│       ├── encryption.ts               // Data encryption
│       └── __tests__/
└── docs/
    ├── README.md                       // Package overview
    ├── logging-guide.md                // Logging implementation guide
    ├── metrics-guide.md                // Metrics implementation guide
    ├── tracing-guide.md                // Tracing implementation guide
    ├── analytics-guide.md              // Analytics implementation guide
    └── alerting-guide.md               // Alerting setup guide
```

## Key Features

### Structured Logging
- **Winston Integration**: Enterprise-grade logging with Winston
- **Contextual Logging**: Request correlation and context preservation
- **Log Levels**: Configurable log levels (error, warn, info, debug, trace)
- **Structured Format**: JSON-structured logs for easy parsing
- **GDPR Compliance**: PII sanitization and compliant log retention
- **Performance Optimized**: Async logging with buffering

### Metrics Collection
- **Prometheus Integration**: Industry-standard metrics collection
- **Business Metrics**: Creator earnings, subscription rates, engagement
- **Technical Metrics**: Response times, error rates, resource usage
- **Custom Metrics**: Flexible custom metric definitions
- **Label Management**: Efficient metric labeling and cardinality control
- **Real-time Monitoring**: Live metric updates and alerting

### Distributed Tracing
- **OpenTelemetry**: Standards-based distributed tracing
- **Auto-instrumentation**: Automatic tracing for common libraries
- **Custom Spans**: Manual span creation for business logic
- **Context Propagation**: Trace context across service boundaries
- **Performance Analysis**: Detailed performance bottleneck identification
- **Error Tracking**: Comprehensive error trace correlation

### Creator Analytics
- **Performance Metrics**: Views, engagement, conversion rates
- **Revenue Analytics**: Earnings, subscription growth, tip analytics
- **Audience Insights**: Demographic analysis, retention metrics
- **Content Analytics**: Content performance, trending analysis
- **Growth Tracking**: Follower growth, reach expansion
- **Comparative Analysis**: Peer benchmarking and industry comparisons

## Usage Examples

### Structured Logging
```typescript
import { Logger } from '@packages/observability/logging';

const logger = Logger.create({
  service: 'creator-api',
  environment: 'production',
  level: 'info'
});

// Contextual logging
logger.info('User login attempt', {
  userId: 'user_123',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  correlationId: 'req_456'
});

// Error logging with stack trace
logger.error('Payment processing failed', {
  error: error.message,
  stack: error.stack,
  paymentId: 'payment_789',
  amount: 29.99,
  currency: 'USD'
});
```

### Creator Analytics
```typescript
import { CreatorAnalytics } from '@packages/observability/analytics';

const analytics = new CreatorAnalytics();

// Track creator performance
await analytics.trackCreatorMetrics({
  creatorId: 'creator_123',
  metrics: {
    contentViews: 1250,
    newSubscribers: 45,
    revenue: 892.50,
    engagement: 0.67,
    retention: 0.85
  },
  timestamp: new Date(),
  correlationId: 'analytics_456'
});

// Generate creator insights
const insights = await analytics.generateInsights({
  creatorId: 'creator_123',
  timeRange: 'last_30_days',
  compareWith: 'previous_period'
});
```

### Distributed Tracing
```typescript
import { Tracer } from '@packages/observability/tracing';

const tracer = Tracer.create('payment-service');

// Create custom span
async function processPayment(paymentData: PaymentData) {
  const span = tracer.startSpan('payment.process', {
    attributes: {
      'payment.id': paymentData.id,
      'payment.amount': paymentData.amount,
      'payment.currency': paymentData.currency
    }
  });

  try {
    const result = await stripeClient.processPayment(paymentData);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ 
      code: SpanStatusCode.ERROR, 
      message: error.message 
    });
    throw error;
  } finally {
    span.end();
  }
}
```

## Dependencies
- **Winston**: ^3.10.0 - Structured logging library
- **Prometheus**: ^14.2.0 - Metrics collection and storage
- **OpenTelemetry**: ^1.15.0 - Distributed tracing framework
- **Mixpanel**: ^0.17.0 - User analytics platform
- **Grafana**: ^10.0.0 - Metrics visualization platform
- **DataDog**: ^5.0.0 - Application performance monitoring 