# apps/workers - Background Processing

this is marked as iteration 2 because initially, it won't be used.

> **Queue-based job processing** for heavy operations like content processing, notifications, and analytics

## Overview
Background job processing service handling compute-intensive tasks including video processing, image optimization, notifications, analytics aggregation, and scheduled operations.

## Tech Stack
- **Node.js** with TypeScript
- **BullMQ** for job queues
- **Redis** for job storage
- **Sharp** for image processing
- **FFmpeg** for video processing
- **Vercel Cron** for scheduled jobs

## File Structure
```typescript
workers/
├── package.json       // Dependencies: bullmq, redis, sharp, ffmpeg
├── vercel.json       // Vercel cron jobs configuration
├── src/
│   ├── index.ts      // Worker service entry point
│   ├── queues/       // Job queue definitions
│   │   ├── QueueManager.ts        // Central queue management
│   │   ├── contentQueue.ts        // Content processing queue
│   │   ├── notificationQueue.ts   // Notification queue
│   │   ├── analyticsQueue.ts      // Analytics processing queue
│   │   ├── paymentQueue.ts        // Payment processing queue
│   │   ├── emailQueue.ts          // Email sending queue
│   │   ├── moderationQueue.ts     // Content moderation queue
│   │   └── __tests__/
│   ├── jobs/         // Job processors
│   │   ├── content/
│   │   │   ├── VideoProcessor.ts   // Video transcoding & compression
│   │   │   ├── ImageOptimizer.ts   // Image compression & resizing
│   │   │   ├── ThumbnailGenerator.ts // Video thumbnail generation
│   │   │   ├── AudioProcessor.ts   // Audio compression & format conversion
│   │   │   ├── LiveStreamProcessor.ts // Live stream processing
│   │   │   ├── WatermarkApplier.ts // Apply creator watermarks
│   │   │   └── __tests__/
│   │   ├── notifications/
│   │   │   ├── EmailSender.ts      // Email notification delivery
│   │   │   ├── PushNotifier.ts     // Push notification delivery
│   │   │   ├── SMSSender.ts        // SMS notification delivery
│   │   │   ├── WebhookNotifier.ts  // Webhook notifications
│   │   │   ├── DiscordNotifier.ts  // Discord integration
│   │   │   └── __tests__/
│   │   ├── analytics/
│   │   │   ├── MetricsAggregator.ts    // Aggregate usage metrics
│   │   │   ├── RevenueCalculator.ts    // Calculate revenue metrics
│   │   │   ├── ContentAnalyzer.ts      // Analyze content performance
│   │   │   ├── UserBehaviorAnalyzer.ts // Analyze user behavior
│   │   │   ├── ReportGenerator.ts      // Generate analytics reports
│   │   │   └── __tests__/
│   │   ├── payments/
│   │   │   ├── PayoutProcessor.ts      // Process creator payouts
│   │   │   ├── SubscriptionProcessor.ts // Handle subscription billing
│   │   │   ├── TaxCalculator.ts        // Calculate taxes
│   │   │   ├── RevenueDistributor.ts   // Distribute revenue shares
│   │   │   ├── RefundProcessor.ts      // Process refunds
│   │   │   └── __tests__/
│   │   ├── moderation/
│   │   │   ├── ContentModerator.ts     // AI content moderation
│   │   │   ├── ImageModerator.ts       // Image content scanning
│   │   │   ├── VideoModerator.ts       // Video content scanning
│   │   │   ├── TextModerator.ts        // Text content filtering
│   │   │   ├── UserReportProcessor.ts  // Process user reports
│   │   │   └── __tests__/
│   │   ├── maintenance/
│   │   │   ├── DatabaseCleaner.ts      // Clean old data
│   │   │   ├── FileCleanup.ts          // Remove unused files
│   │   │   ├── LogRotator.ts           // Rotate log files
│   │   │   ├── BackupGenerator.ts      // Generate backups
│   │   │   └── __tests__/
│   │   └── social/
│   │       ├── FeedUpdater.ts          // Update user feeds
│   │       ├── RecommendationEngine.ts // Generate recommendations
│   │       ├── TrendingCalculator.ts   // Calculate trending content
│   │       ├── SearchIndexer.ts        // Update search indexes
│   │       └── __tests__/
│   ├── processors/   // Job processor implementations
│   │   ├── BaseProcessor.ts           // Base job processor class
│   │   ├── ContentProcessor.ts        // Content processing coordinator
│   │   ├── NotificationProcessor.ts   // Notification coordinator
│   │   ├── AnalyticsProcessor.ts      // Analytics coordinator
│   │   ├── PaymentProcessor.ts        // Payment coordinator
│   │   └── __tests__/
│   ├── services/     // Worker services
│   │   ├── QueueService.ts            // Queue management service
│   │   ├── SchedulerService.ts        // Job scheduling service
│   │   ├── MonitoringService.ts       // Job monitoring service
│   │   ├── RetryService.ts            // Failed job retry logic
│   │   ├── PriorityService.ts         // Job priority management
│   │   └── __tests__/
│   ├── integrations/ // External service integrations
│   │   ├── cloudinary/
│   │   │   ├── CloudinaryUploader.ts  // Cloudinary file upload
│   │   │   ├── ImageTransformer.ts    // Image transformations
│   │   │   ├── VideoTranscoder.ts     // Video transcoding
│   │   │   └── __tests__/
│   │   ├── aws/
│   │   │   ├── S3Uploader.ts          // AWS S3 file upload
│   │   │   ├── RekognitionAnalyzer.ts // AWS Rekognition for moderation
│   │   │   ├── TranscribeProcessor.ts // AWS Transcribe for audio
│   │   │   └── __tests__/
│   │   ├── email/
│   │   │   ├── SendGridSender.ts      // SendGrid email delivery
│   │   │   ├── MailgunSender.ts       // Mailgun email delivery
│   │   │   ├── TemplateRenderer.ts    // Email template rendering
│   │   │   └── __tests__/
│   │   ├── push/
│   │   │   ├── FCMSender.ts           // Firebase Cloud Messaging
│   │   │   ├── APNSSender.ts          // Apple Push Notifications
│   │   │   ├── WebPushSender.ts       // Web push notifications
│   │   │   └── __tests__/
│   │   └── analytics/
│   │       ├── MixpanelTracker.ts     // Mixpanel analytics
│   │       ├── AmplitudeTracker.ts    // Amplitude analytics
│   │       ├── GoogleAnalytics.ts     // Google Analytics
│   │       └── __tests__/
│   ├── utils/
│   │   ├── redis.ts               // Redis connection utilities
│   │   ├── logger.ts              // Worker logging utilities
│   │   ├── errorHandler.ts        // Job error handling
│   │   ├── retryLogic.ts          // Job retry utilities
│   │   ├── monitoring.ts          // Job monitoring utilities
│   │   └── __tests__/
│   └── types/        // Worker TypeScript types
│       ├── Job.ts                // Job definition types
│       ├── Queue.ts              // Queue configuration types
│       ├── Processor.ts          // Processor types
│       └── index.ts
└── cron/            // Scheduled jobs (Vercel Cron)
    ├── daily/
    │   ├── analytics-aggregation.ts   // Daily analytics aggregation
    │   ├── content-cleanup.ts         // Daily content cleanup
    │   ├── user-engagement.ts         // Daily engagement reports
    │   └── backup-generation.ts       // Daily backup generation
    ├── weekly/
    │   ├── creator-payouts.ts         // Weekly creator payouts
    │   ├── performance-reports.ts     // Weekly performance reports
    │   ├── system-maintenance.ts      // Weekly system maintenance
    │   └── trend-calculation.ts       // Weekly trending calculation
    ├── monthly/
    │   ├── tax-calculations.ts        // Monthly tax calculations
    │   ├── revenue-reports.ts         // Monthly revenue reports
    │   ├── user-retention.ts          // Monthly retention analysis
    │   └── platform-metrics.ts        // Monthly platform metrics
    └── __tests__/
```

## Key Features

### Content Processing
- **Video Transcoding**: Multiple format support (MP4, WebM, HLS)
- **Image Optimization**: Compression, resizing, format conversion
- **Thumbnail Generation**: Automatic video thumbnail creation
- **Audio Processing**: Compression and format conversion
- **Watermark Application**: Creator branding on content
- **Live Stream Processing**: Real-time stream optimization

### Notification System
- **Multi-channel Delivery**: Email, push, SMS, webhooks
- **Template Management**: Dynamic notification templates
- **Delivery Tracking**: Notification delivery status
- **Retry Logic**: Failed notification retry mechanism
- **Batch Processing**: Efficient bulk notifications
- **Personalization**: User-specific notification content

### Analytics Processing
- **Real-time Aggregation**: Live metrics calculation
- **Revenue Analytics**: Creator earnings and platform revenue
- **Content Performance**: View counts, engagement metrics
- **User Behavior**: Interaction patterns and preferences
- **Report Generation**: Automated report creation
- **Trend Analysis**: Trending content identification

### Payment Processing
- **Automated Payouts**: Scheduled creator payments
- **Tax Calculations**: Automatic tax computation
- **Revenue Distribution**: Platform commission handling
- **Subscription Billing**: Recurring payment processing
- **Refund Processing**: Automated refund handling
- **Payment Analytics**: Financial performance metrics

### Content Moderation
- **AI-powered Scanning**: Automated content analysis
- **Image Moderation**: Inappropriate image detection
- **Video Moderation**: Video content scanning
- **Text Filtering**: Harmful text detection
- **User Report Processing**: Community moderation
- **Appeal Handling**: Moderation appeal workflow

## Job Queue Configuration
```typescript
// Queue priorities and processing
const QUEUE_CONFIG = {
  content: {
    priority: {
      LIVE_STREAM: 10,      // Highest priority
      VIDEO_PROCESSING: 7,   // High priority
      IMAGE_OPTIMIZATION: 5, // Medium priority
      THUMBNAIL_GEN: 3       // Low priority
    },
    concurrency: {
      VIDEO_PROCESSING: 2,   // 2 concurrent video jobs
      IMAGE_OPTIMIZATION: 5, // 5 concurrent image jobs
      THUMBNAIL_GEN: 10      // 10 concurrent thumbnail jobs
    }
  },
  notifications: {
    priority: {
      LIVE_ALERTS: 10,       // Immediate delivery
      PAYMENT_SUCCESS: 8,    // High priority
      CONTENT_UPLOAD: 5,     // Medium priority
      WEEKLY_DIGEST: 2       // Low priority
    },
    retries: 3,              // 3 retry attempts
    backoff: 'exponential'   // Exponential backoff
  }
};
```

## Cron Job Schedule
```typescript
// vercel.json cron configuration
{
  "crons": [
    {
      "path": "/api/cron/daily/analytics",
      "schedule": "0 2 * * *"  // Daily at 2 AM UTC
    },
    {
      "path": "/api/cron/weekly/payouts",
      "schedule": "0 10 * * 1"  // Monday at 10 AM UTC
    },
    {
      "path": "/api/cron/monthly/reports",
      "schedule": "0 9 1 * *"   // 1st of month at 9 AM UTC
    }
  ]
}
```

## Environment Configuration
```typescript
// .env
REDIS_URL="redis://localhost:6379"
CLOUDINARY_CLOUD_NAME="odyssey-creator"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
SENDGRID_API_KEY="..."
FCM_SERVER_KEY="..."
MIXPANEL_TOKEN="..."
```

## Monitoring & Observability
- **Job Status Tracking**: Real-time job status monitoring
- **Performance Metrics**: Job processing time and success rates
- **Error Reporting**: Comprehensive error tracking
- **Queue Health**: Queue depth and processing metrics
- **Resource Usage**: CPU and memory utilization tracking
- **Alert System**: Automated alerts for job failures

## Deployment
- **Vercel Functions**: Serverless job processing
- **Redis Queues**: Persistent job storage
- **Cron Jobs**: Scheduled task execution
- **Auto-scaling**: Dynamic worker scaling based on queue depth 