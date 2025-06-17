# packages/media - Content Processing & Storage

> **Media handling** for photos, videos, live streams, and file storage

## Overview
Comprehensive media processing package handling all aspects of content creation, storage, and delivery for a creator monetization platform. Includes image/video processing, live streaming, content moderation, and GDPR-compliant storage solutions.

## Tech Stack
- **Sharp** for image processing
- **FFmpeg** for video/audio processing
- **Cloudinary** for media CDN and transformations
- **WebRTC** for live streaming
- **Redis** for caching and live data
- **OpenAI** for content moderation
- **TypeScript** for type safety

## File Structure
```typescript
media/
├── package.json       // Dependencies: sharp, ffmpeg, cloudinary, webrtc
├── src/
│   ├── image/        // Image processing utilities
│   │   ├── processing/
│   │   │   ├── compress.ts            // Image compression algorithms
│   │   │   ├── resize.ts              // Image resizing with quality
│   │   │   ├── optimize.ts            // Format optimization (WebP, AVIF)
│   │   │   ├── crop.ts                // Smart cropping utilities
│   │   │   ├── filters.ts             // Image filters and effects
│   │   │   ├── watermark.ts           // Creator watermark overlay
│   │   │   └── __tests__/
│   │   ├── formats/
│   │   │   ├── converter.ts           // Format conversion utilities
│   │   │   ├── detector.ts            // Image format detection
│   │   │   ├── validator.ts           // Format validation
│   │   │   └── __tests__/
│   │   ├── metadata/
│   │   │   ├── extractor.ts           // EXIF and metadata extraction
│   │   │   ├── sanitizer.ts           // Privacy-safe metadata
│   │   │   ├── analyzer.ts            // Image analysis (size, quality)
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── validation.ts          // Image validation utilities
│   │       ├── dimensions.ts          // Dimension calculations
│   │       ├── colors.ts              // Color analysis
│   │       └── __tests__/
│   ├── video/        // Video processing utilities
│   │   ├── processing/
│   │   │   ├── compress.ts            // Video compression (H.264, H.265)
│   │   │   ├── transcode.ts           // Format transcoding
│   │   │   ├── thumbnail.ts           // Video thumbnail generation
│   │   │   ├── preview.ts             // Video preview generation
│   │   │   ├── watermark.ts           // Video watermark overlay
│   │   │   ├── stabilize.ts           // Video stabilization
│   │   │   └── __tests__/
│   │   ├── streaming/
│   │   │   ├── hls.ts                 // HLS streaming preparation
│   │   │   ├── dash.ts                // DASH streaming preparation
│   │   │   ├── adaptive.ts            // Adaptive bitrate streaming
│   │   │   ├── segments.ts            // Video segmentation
│   │   │   └── __tests__/
│   │   ├── analysis/
│   │   │   ├── quality.ts             // Video quality analysis
│   │   │   ├── duration.ts            // Duration extraction
│   │   │   ├── resolution.ts          // Resolution detection
│   │   │   ├── bitrate.ts             // Bitrate analysis
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── validation.ts          // Video validation
│   │       ├── codecs.ts              // Codec detection/support
│   │       ├── metadata.ts            // Video metadata handling
│   │       └── __tests__/
│   ├── audio/        // Audio processing utilities
│   │   ├── processing/
│   │   │   ├── compress.ts            // Audio compression (MP3, AAC, OGG)
│   │   │   ├── transcode.ts           // Audio format conversion
│   │   │   ├── normalize.ts           // Audio normalization
│   │   │   ├── effects.ts             // Audio effects processing
│   │   │   └── __tests__/
│   │   ├── analysis/
│   │   │   ├── waveform.ts            // Waveform generation
│   │   │   ├── spectogram.ts          // Audio spectrum analysis
│   │   │   ├── volume.ts              // Volume level analysis
│   │   │   ├── silence.ts             // Silence detection
│   │   │   └── __tests__/
│   │   ├── streaming/
│   │   │   ├── segments.ts            // Audio streaming segments
│   │   │   ├── playlist.ts            // Streaming playlist generation
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── validation.ts          // Audio validation
│   │       ├── metadata.ts            // Audio metadata extraction
│   │       ├── formats.ts             // Format support utilities
│   │       └── __tests__/
│   ├── live/         // Live streaming infrastructure
│   │   ├── streaming/
│   │   │   ├── rtmp.ts                // RTMP server integration
│   │   │   ├── webrtc.ts              // WebRTC peer connections
│   │   │   ├── sip.ts                 // SIP protocol support
│   │   │   ├── relay.ts               // Stream relay and distribution
│   │   │   └── __tests__/
│   │   ├── chat/
│   │   │   ├── manager.ts             // Live chat management
│   │   │   ├── moderation.ts          // Chat moderation
│   │   │   ├── emotes.ts              // Emote system
│   │   │   ├── reactions.ts           // Live reactions
│   │   │   └── __tests__/
│   │   ├── analytics/
│   │   │   ├── viewers.ts             // Live viewer tracking
│   │   │   ├── engagement.ts          // Engagement metrics
│   │   │   ├── quality.ts             // Stream quality monitoring
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── validation.ts          // Stream validation
│   │       ├── connection.ts          // Connection management
│   │       ├── quality.ts             // Quality adaptation
│   │       └── __tests__/
│   ├── storage/      // File storage and CDN
│   │   ├── providers/
│   │   │   ├── cloudinary.ts          // Cloudinary integration
│   │   │   ├── s3.ts                  // AWS S3 integration
│   │   │   ├── gcs.ts                 // Google Cloud Storage
│   │   │   ├── azure.ts               // Azure Blob Storage
│   │   │   └── __tests__/
│   │   ├── cdn/
│   │   │   ├── distribution.ts        // CDN distribution management
│   │   │   ├── caching.ts             // Cache management
│   │   │   ├── purging.ts             // Cache purging utilities
│   │   │   ├── optimization.ts        // Delivery optimization
│   │   │   └── __tests__/
│   │   ├── backup/
│   │   │   ├── redundancy.ts          // Multi-region redundancy
│   │   │   ├── archiving.ts           // Content archiving
│   │   │   ├── restoration.ts         // Content restoration
│   │   │   └── __tests__/
│   │   ├── gdpr/
│   │   │   ├── compliance.ts          // GDPR storage compliance
│   │   │   ├── deletion.ts            // Right to erasure
│   │   │   ├── portability.ts         // Data portability
│   │   │   ├── encryption.ts          // Data encryption at rest
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── upload.ts              // Upload utilities
│   │       ├── download.ts            // Download utilities
│   │       ├── urls.ts                // URL generation
│   │       ├── permissions.ts         // Access control
│   │       └── __tests__/
│   ├── moderation/   // Content moderation
│   │   ├── ai/
│   │   │   ├── vision.ts              // AI image/video analysis
│   │   │   ├── audio.ts               // AI audio analysis
│   │   │   ├── text.ts                // AI text analysis
│   │   │   ├── nsfw.ts                // NSFW content detection
│   │   │   ├── violence.ts            // Violence detection
│   │   │   └── __tests__/
│   │   ├── manual/
│   │   │   ├── review.ts              // Manual review system
│   │   │   ├── flagging.ts            // Content flagging
│   │   │   ├── appeals.ts             // Appeal process
│   │   │   ├── escalation.ts          // Escalation workflows
│   │   │   └── __tests__/
│   │   ├── rules/
│   │   │   ├── policies.ts            // Content policies
│   │   │   ├── scoring.ts             // Content scoring system
│   │   │   ├── thresholds.ts          // Moderation thresholds
│   │   │   ├── actions.ts             // Automated actions
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── classification.ts      // Content classification
│   │       ├── confidence.ts          // Confidence scoring
│   │       ├── reporting.ts           // Moderation reporting
│   │       └── __tests__/
│   ├── analytics/    // Media analytics
│   │   ├── engagement/
│   │   │   ├── views.ts               // View tracking and analytics
│   │   │   ├── interactions.ts        // Interaction tracking
│   │   │   ├── retention.ts           // Content retention metrics
│   │   │   ├── sharing.ts             // Share analytics
│   │   │   └── __tests__/
│   │   ├── performance/
│   │   │   ├── loadTimes.ts           // Content load performance
│   │   │   ├── quality.ts             // Quality metrics
│   │   │   ├── bandwidth.ts           // Bandwidth usage
│   │   │   ├── errors.ts              // Error tracking
│   │   │   └── __tests__/
│   │   ├── revenue/
│   │   │   ├── monetization.ts        // Revenue per content
│   │   │   ├── conversion.ts          // Conversion tracking
│   │   │   ├── subscriptions.ts       // Subscription impact
│   │   │   └── __tests__/
│   │   └── reporting/
│   │       ├── dashboards.ts          // Analytics dashboards
│   │       ├── exports.ts             // Data export utilities
│   │       ├── insights.ts            // Automated insights
│   │       └── __tests__/
│   ├── search/       // Content search and discovery
│   │   ├── indexing/
│   │   │   ├── metadata.ts            // Metadata indexing
│   │   │   ├── content.ts             // Content indexing
│   │   │   ├── tags.ts                // Tag indexing
│   │   │   ├── elasticsearch.ts       // Elasticsearch integration
│   │   │   └── __tests__/
│   │   ├── algorithms/
│   │   │   ├── similarity.ts          // Content similarity
│   │   │   ├── recommendations.ts     // Content recommendations
│   │   │   ├── trending.ts            // Trending algorithms
│   │   │   ├── personalization.ts     // Personalized search
│   │   │   └── __tests__/
│   │   └── filters/
│   │       ├── content.ts             // Content filtering
│   │       ├── creators.ts            // Creator filtering
│   │       ├── categories.ts          // Category filtering
│   │       ├── dates.ts               // Date range filtering
│   │       └── __tests__/
│   ├── transformations/ // Media transformations
│   │   ├── responsive/
│   │   │   ├── images.ts              // Responsive image generation
│   │   │   ├── videos.ts              // Responsive video streams
│   │   │   ├── breakpoints.ts         // Breakpoint management
│   │   │   └── __tests__/
│   │   ├── optimization/
│   │   │   ├── quality.ts             // Quality optimization
│   │   │   ├── size.ts                // Size optimization
│   │   │   ├── formats.ts             // Format optimization
│   │   │   ├── lazy.ts                // Lazy loading optimization
│   │   │   └── __tests__/
│   │   └── branding/
│   │       ├── watermarks.ts          // Watermark application
│   │       ├── overlays.ts            // Brand overlay application
│   │       ├── frames.ts              // Brand frame application
│   │       └── __tests__/
│   ├── queue/        // Processing queues
│   │   ├── jobs/
│   │   │   ├── processing.ts          // Media processing jobs
│   │   │   ├── upload.ts              // Upload processing jobs
│   │   │   ├── moderation.ts          // Moderation jobs
│   │   │   ├── analytics.ts           // Analytics processing jobs
│   │   │   └── __tests__/
│   │   ├── workers/
│   │   │   ├── image.ts               // Image processing workers
│   │   │   ├── video.ts               // Video processing workers
│   │   │   ├── audio.ts               // Audio processing workers
│   │   │   ├── live.ts                // Live stream workers
│   │   │   └── __tests__/
│   │   └── management/
│   │       ├── scheduling.ts          // Job scheduling
│   │       ├── priorities.ts          // Priority management
│   │       ├── retries.ts             // Retry logic
│   │       ├── monitoring.ts          // Queue monitoring
│   │       └── __tests__/
│   ├── types/        // Media-specific types
│   │   ├── Image.ts                   // Image type definitions
│   │   ├── Video.ts                   // Video type definitions
│   │   ├── Audio.ts                   // Audio type definitions
│   │   ├── Live.ts                    // Live stream types
│   │   ├── Storage.ts                 // Storage types
│   │   ├── Moderation.ts              // Moderation types
│   │   ├── Analytics.ts               // Analytics types
│   │   └── index.ts
│   ├── validation/   // Media validation schemas
│   │   ├── upload.ts                  // Upload validation
│   │   ├── formats.ts                 // Format validation
│   │   ├── size.ts                    // Size validation
│   │   ├── quality.ts                 // Quality validation
│   │   ├── metadata.ts                // Metadata validation
│   │   └── __tests__/
│   └── utils/        // Media utilities
│       ├── constants.ts               // Media constants
│       ├── helpers.ts                 // Helper functions
│       ├── converters.ts              // Unit converters
│       ├── mime.ts                    // MIME type utilities
│       └── __tests__/
└── docs/
    ├── README.md                      // Package overview
    ├── image-processing.md            // Image processing guide
    ├── video-processing.md            // Video processing guide
    ├── live-streaming.md              // Live streaming guide
    ├── storage-integration.md         // Storage integration guide
    └── content-moderation.md          // Moderation guide
```

## Key Features

### Image Processing
- **Format Support**: JPEG, PNG, WebP, AVIF, SVG
- **Compression**: Lossless and lossy compression algorithms
- **Resizing**: Smart resizing with aspect ratio preservation
- **Optimization**: Automatic format selection for best performance
- **Watermarking**: Creator branding and copyright protection
- **Filters**: Instagram-style filters and effects

### Video Processing
- **Format Support**: MP4, WebM, AVI, MOV, MKV
- **Transcoding**: Multi-format transcoding with quality presets
- **Streaming**: HLS and DASH adaptive streaming preparation
- **Thumbnails**: Automatic thumbnail generation
- **Compression**: Optimized compression for web delivery
- **Watermarking**: Video watermark overlay

### Audio Processing
- **Format Support**: MP3, AAC, OGG, FLAC, WAV
- **Compression**: High-quality audio compression
- **Normalization**: Audio level normalization
- **Waveform**: Visual waveform generation
- **Effects**: Audio effects and enhancement
- **Streaming**: Audio streaming optimization

### Live Streaming
- **RTMP Support**: Real-time messaging protocol
- **WebRTC**: Peer-to-peer streaming
- **Chat Integration**: Real-time chat system
- **Quality Adaptation**: Adaptive bitrate streaming
- **Recording**: Stream recording and archiving
- **Analytics**: Live stream analytics

### Content Moderation
- **AI-Powered**: Automated content analysis
- **NSFW Detection**: Adult content detection
- **Violence Detection**: Harmful content identification
- **Manual Review**: Human moderation workflows
- **Appeals Process**: Content appeal system
- **Policy Enforcement**: Automated policy enforcement

### Storage & CDN
- **Multi-Provider**: Cloudinary, AWS S3, Google Cloud, Azure
- **Global CDN**: Worldwide content delivery
- **Caching**: Intelligent caching strategies
- **Redundancy**: Multi-region backup and redundancy
- **GDPR Compliance**: Privacy-compliant storage
- **Access Control**: Fine-grained permissions

## Usage Examples

### Image Processing
```typescript
import { ImageProcessor } from '@packages/media/image';

const processor = new ImageProcessor();

// Process uploaded image
const processedImage = await processor.process({
  input: uploadedFile,
  operations: [
    { type: 'resize', width: 1200, height: 800 },
    { type: 'compress', quality: 85 },
    { type: 'watermark', text: 'Creator Name', position: 'bottom-right' },
    { type: 'optimize', format: 'webp' }
  ]
});

// Generate responsive variants
const variants = await processor.generateVariants({
  input: processedImage,
  breakpoints: [320, 640, 1024, 1920]
});
```

### Video Processing
```typescript
import { VideoProcessor } from '@packages/media/video';

const processor = new VideoProcessor();

// Process uploaded video
const processedVideo = await processor.process({
  input: videoFile,
  operations: [
    { type: 'transcode', format: 'mp4', codec: 'h264' },
    { type: 'compress', quality: 'high', bitrate: '2000k' },
    { type: 'thumbnail', timestamps: [0, 10, 30] },
    { type: 'watermark', image: creatorLogo, position: 'top-right' }
  ]
});

// Prepare for streaming
const streamingManifest = await processor.prepareStreaming({
  input: processedVideo,
  formats: ['hls', 'dash'],
  qualities: ['360p', '720p', '1080p']
});
```

### Live Streaming
```typescript
import { LiveStreamManager } from '@packages/media/live';

const streamManager = new LiveStreamManager();

// Start live stream
const stream = await streamManager.createStream({
  creatorId: 'creator_123',
  title: 'Live Drawing Session',
  category: 'art',
  settings: {
    quality: '1080p',
    bitrate: '3000k',
    chatEnabled: true,
    recordingEnabled: true
  }
});

// Handle stream events
stream.on('viewer:join', (viewer) => {
  console.log(`${viewer.username} joined the stream`);
});

stream.on('chat:message', (message) => {
  // Handle chat moderation
  moderationService.checkMessage(message);
});
```

### Content Moderation
```typescript
import { ContentModerator } from '@packages/media/moderation';

const moderator = new ContentModerator();

// Moderate uploaded content
const analysis = await moderator.analyze({
  content: uploadedFile,
  type: 'image',
  checks: ['nsfw', 'violence', 'copyright'],
  threshold: 0.8
});

if (analysis.flagged) {
  // Handle flagged content
  await moderator.quarantine(uploadedFile);
  await moderator.notifyModerators(analysis);
} else {
  // Content approved
  await moderator.approve(uploadedFile);
}
```

### Storage Management
```typescript
import { StorageManager } from '@packages/media/storage';

const storage = new StorageManager({
  primary: 'cloudinary',
  backup: 's3',
  cdn: 'cloudflare'
});

// Upload with automatic optimization
const uploadResult = await storage.upload({
  file: mediaFile,
  folder: 'creator/content',
  transformations: {
    image: [
      { resize: { width: 1200, height: 800 } },
      { format: 'auto' },
      { quality: 'auto' }
    ]
  },
  backup: true,
  gdprCompliant: true
});

// Generate CDN URLs
const urls = storage.generateUrls(uploadResult.publicId, {
  responsive: true,
  webp: true,
  progressive: true
});
```

## Configuration

### Environment Variables
```typescript
// Storage configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

AWS_S3_BUCKET="your-s3-bucket"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

// Processing configuration
FFMPEG_PATH="/usr/local/bin/ffmpeg"
SHARP_CACHE_SIZE="50MB"
REDIS_URL="redis://localhost:6379"

// Moderation configuration
OPENAI_API_KEY="your-openai-key"
CONTENT_MODERATION_THRESHOLD="0.8"
MANUAL_REVIEW_QUEUE="moderation-queue"

// Live streaming configuration
RTMP_SERVER_URL="rtmp://live.example.com/live"
WEBRTC_TURN_SERVER="turn:turn.example.com"
STREAM_RECORDING_ENABLED="true"
```

### Processing Presets
```typescript
const imagePresets = {
  thumbnail: {
    resize: { width: 150, height: 150, crop: 'fill' },
    format: 'webp',
    quality: 80
  },
  preview: {
    resize: { width: 800, height: 600, crop: 'limit' },
    format: 'auto',
    quality: 85
  },
  fullsize: {
    resize: { width: 1920, height: 1080, crop: 'limit' },
    format: 'auto',
    quality: 90
  }
};

const videoPresets = {
  mobile: {
    resolution: '480p',
    bitrate: '500k',
    fps: 30,
    codec: 'h264'
  },
  desktop: {
    resolution: '1080p',
    bitrate: '2000k',
    fps: 60,
    codec: 'h264'
  },
  hd: {
    resolution: '1440p',
    bitrate: '4000k',
    fps: 60,
    codec: 'h265'
  }
};
```

## Performance Optimizations
- **Parallel Processing**: Multi-threaded processing for large files
- **Queue Management**: Priority-based job queues
- **Caching**: Intelligent caching at multiple levels
- **Progressive Loading**: Progressive image and video loading
- **Lazy Processing**: On-demand processing for unused variants
- **CDN Integration**: Global content delivery optimization

## Security Features
- **Access Control**: Fine-grained file permissions
- **Encryption**: End-to-end encryption for sensitive content
- **Watermarking**: Copyright protection and branding
- **Content Scanning**: Automated security scanning
- **GDPR Compliance**: Privacy-compliant data handling
- **Audit Logging**: Comprehensive access and modification logging

## Dependencies
- **Sharp**: ^0.32.0 - High-performance image processing
- **FFmpeg**: ^6.0.0 - Video and audio processing
- **Cloudinary**: ^1.40.0 - Media management platform
- **AWS SDK**: ^3.0.0 - AWS services integration
- **Redis**: ^4.6.0 - Caching and queue management
- **OpenAI**: ^4.0.0 - AI-powered content moderation 