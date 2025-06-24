# Packages/Media - Odyssey Creator Platform (MVP - Iteration 1)

> **Basic Image Handling** - Simple image upload and display functionality only

## Architecture Overview

Minimal media package providing **only essential** image upload and display functionality for MVP launch. All advanced media processing moved to iteration 2.

## Directory Structure

```
packages/media/
├── src/
│   ├── image/
│   │   ├── upload.ts               # ✅ Basic image upload
│   │   ├── validation.ts           # ✅ Image validation
│   │   └── index.ts
│   ├── types/
│   │   ├── image.ts                # ✅ Image types
│   │   └── index.ts
│   ├── utils/
│   │   ├── fileSize.ts             # ✅ File size utilities
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Basic Image Features

### **Image Upload**
```typescript
// image/upload.ts
export interface ImageUploadResult {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface ImageUploadOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

export class ImageUploader {
  private defaultOptions: ImageUploadOptions = {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  };

  async uploadImage(
    file: File,
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> {
    const config = { ...this.defaultOptions, ...options };
    
    // Basic validation
    this.validateImage(file, config);
    
    // Simple upload implementation
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json();
  }

  private validateImage(file: File, options: ImageUploadOptions): void {
    if (options.maxSizeBytes && file.size > options.maxSizeBytes) {
      throw new Error(`File too large. Max size: ${options.maxSizeBytes} bytes`);
    }
    
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`File type not allowed: ${file.type}`);
    }
  }
}
```

### **Image Validation**
```typescript
// image/validation.ts
export const IMAGE_CONSTRAINTS = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_DIMENSION: 2048 // pixels
};

export function validateImageFile(file: File): string[] {
  const errors: string[] = [];
  
  // Check file size
  if (file.size > IMAGE_CONSTRAINTS.MAX_SIZE_BYTES) {
    errors.push(`File size exceeds ${IMAGE_CONSTRAINTS.MAX_SIZE_BYTES / 1024 / 1024}MB limit`);
  }
  
  // Check file type
  if (!IMAGE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    errors.push(`File type ${file.type} not supported`);
  }
  
  return errors;
}

export function validateImageUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

### **Image Types**
```typescript
// types/image.ts
export interface ImageFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedAt: Date;
}

export interface ImageUploadRequest {
  file: File;
  alt?: string;
  description?: string;
}

export interface ImageDisplayProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}
```

### **File Size Utilities**
```typescript
// utils/fileSize.ts
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function bytesToMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

export function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}
```

## Dependencies

```json
{
  "dependencies": {},
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## MVP Features ✅

- ✅ Basic image upload functionality
- ✅ Image file validation (size, type)
- ✅ Simple image display components
- ✅ File size utilities and formatting
- ✅ Basic image types and interfaces
- ✅ URL validation for images

## Excluded from MVP (Moved to Iteration 2) ❌

- ❌ Video upload and processing
- ❌ Audio upload and processing
- ❌ Live streaming capabilities
- ❌ Image transformation (resize, crop, filters)
- ❌ Multiple image upload/gallery
- ❌ CDN integration
- ❌ Image optimization
- ❌ Thumbnail generation
- ❌ Advanced media metadata
- ❌ Progressive image loading
- ❌ Image compression
- ❌ Watermarking
- ❌ Advanced media management

## Usage Examples

### **React Image Upload Component**
```typescript
// In apps/web
import { ImageUploader, validateImageFile } from '@odyssey/media';

function ImageUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploader = new ImageUploader();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationErrors = validateImageFile(file);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploader.uploadImage(file);
      console.log('Upload successful:', result);
      // Handle success
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

### **Backend Image Upload Handler**
```typescript
// In apps/api
import { validateImageFile } from '@odyssey/media';

app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Basic validation
    const errors = validateImageFile(file as any);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }

    // Save file (simplified)
    const imageUrl = await saveFileToStorage(file);
    
    res.json({
      id: generateId(),
      url: imageUrl,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

### **Image Display Component**
```typescript
// In apps/web
import { ImageDisplayProps } from '@odyssey/media';

function ImageDisplay({ src, alt, width, height, loading = 'lazy' }: ImageDisplayProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div style={{ background: '#f0f0f0', width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Image not available
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onError={() => setImageError(true)}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}
```

This package provides **only the absolute minimum** media functionality needed for MVP launch, focusing on basic image upload and display without any complex processing or advanced features. 