# packages/media - Content Processing & Storage

> **Basic media handling** for photos and videos

## Overview
Basic media processing package handling essential content upload, storage, and basic processing for images and videos. Focused on core upload functionality for MVP with Cloudinary integration.

## Tech Stack
- **Sharp** for image processing
- **FFmpeg** for basic video processing
- **Cloudinary** for media storage and CDN
- **TypeScript** for type safety

## File Structure
```typescript
media/
├── package.json       // Dependencies: sharp, ffmpeg, cloudinary
├── src/
│   ├── image/        // Image processing utilities
│   │   ├── processing/
│   │   │   ├── resize.ts              // Image resizing
│   │   │   ├── compress.ts            // Image compression
│   │   │   ├── optimize.ts            // Format optimization (WebP)
│   │   │   └── __tests__/
│   │   ├── formats/
│   │   │   ├── converter.ts           // Format conversion utilities
│   │   │   ├── validator.ts           // Format validation
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── validation.ts          // Image validation utilities
│   │       ├── dimensions.ts          // Dimension calculations
│   │       └── __tests__/
│   ├── video/        // Video processing utilities
│   │   ├── processing/
│   │   │   ├── compress.ts            // Video compression
│   │   │   ├── thumbnail.ts           // Video thumbnail generation
│   │   │   └── __tests__/
│   │   ├── analysis/
│   │   │   ├── duration.ts            // Duration extraction
│   │   │   ├── resolution.ts          // Resolution detection
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── validation.ts          // Video validation
│   │       ├── metadata.ts            // Video metadata handling
│   │       └── __tests__/
│   ├── storage/      // File storage and CDN
│   │   ├── providers/
│   │   │   ├── cloudinary.ts          // Cloudinary integration
│   │   │   └── __tests__/
│   │   └── utils/
│   │       ├── upload.ts              // Upload utilities
│   │       ├── urls.ts                // URL generation
│   │       └── __tests__/
│   ├── types/        // Media-specific types
│   │   ├── Image.ts                   // Image type definitions
│   │   ├── Video.ts                   // Video type definitions
│   │   ├── Storage.ts                 // Storage types
│   │   └── index.ts
│   ├── validation/   // Media validation schemas
│   │   ├── upload.ts                  // Upload validation
│   │   ├── formats.ts                 // Format validation
│   │   ├── size.ts                    // Size validation
│   │   └── __tests__/
│   └── utils/        // Media utilities
│       ├── constants.ts               // Media constants
│       ├── helpers.ts                 // Helper functions
│       ├── mime.ts                    // MIME type utilities
│       └── __tests__/
└── docs/
    ├── README.md                      // Package overview
    ├── image-processing.md            // Image processing guide
    ├── video-processing.md            // Video processing guide
    └── storage-integration.md         // Storage integration guide
```

## Key Features

### Image Processing
- **Format Support**: JPEG, PNG, WebP
- **Compression**: Basic compression for web delivery
- **Resizing**: Simple resizing with aspect ratio preservation
- **Optimization**: Automatic format selection for performance

### Video Processing
- **Format Support**: MP4, WebM
- **Compression**: Basic video compression
- **Thumbnails**: Automatic thumbnail generation
- **Metadata**: Basic video information extraction

### Storage & CDN
- **Cloudinary Integration**: Primary storage and CDN provider
- **Upload Management**: Direct file uploads
- **URL Generation**: Dynamic URL generation for different sizes

## Usage Examples

### Image Processing
```typescript
import { ImageProcessor } from '@packages/media/image';

const processor = new ImageProcessor();

// Process uploaded image
const processedImage = await processor.process({
  input: uploadedFile,
  operations: [
    { type: 'resize', width: 800, height: 600 },
    { type: 'compress', quality: 85 },
    { type: 'optimize', format: 'webp' }
  ]
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
    { type: 'compress', quality: 'medium' },
    { type: 'thumbnail', timestamp: 10 }
  ]
});
```

### Storage Management
```typescript
import { StorageManager } from '@packages/media/storage';

const storage = new StorageManager({
  provider: 'cloudinary'
});

// Upload file
const uploadResult = await storage.upload({
  file: mediaFile,
  folder: 'user-content',
  transformations: {
    resize: { width: 800, height: 600 },
    format: 'auto',
    quality: 'auto'
  }
});

// Generate URLs
const urls = storage.generateUrls(uploadResult.publicId, {
  responsive: true,
  webp: true
});
```

## Configuration

### Environment Variables
```typescript
// Storage configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

// Processing configuration
FFMPEG_PATH="/usr/local/bin/ffmpeg"
SHARP_CACHE_SIZE="50MB"
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
  }
};

const videoPresets = {
  mobile: {
    resolution: '480p',
    bitrate: '500k',
    codec: 'h264'
  },
  desktop: {
    resolution: '720p',
    bitrate: '1000k',
    codec: 'h264'
  }
};
```

## Dependencies
- **Sharp**: ^0.32.0 - High-performance image processing
- **FFmpeg**: ^6.0.0 - Video processing
- **Cloudinary**: ^1.40.0 - Media management platform 