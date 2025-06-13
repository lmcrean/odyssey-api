import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { v2 as cloudinary } from 'cloudinary';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedUrl,
  getTransformedUrl,
  defaultUploadOptions
} from '../cloudinary.config';

describe('Cloudinary Health Check', () => {
  let testImagePublicId: string;

  afterAll(async () => {
    // Clean up test image if it exists
    if (testImagePublicId) {
      try {
        await deleteFromCloudinary(testImagePublicId);
      } catch (error) {
        console.warn('Failed to clean up test image:', error);
      }
    }
  });

  describe('Configuration', () => {
    it('should have cloudinary configured with environment variables', () => {
      const config = cloudinary.config();
      
      expect(config.cloud_name).toBe(process.env.CLOUDINARY_CLOUD_NAME);
      expect(config.api_key).toBe(process.env.CLOUDINARY_API_KEY);
      expect(config.api_secret).toBe(process.env.CLOUDINARY_API_SECRET);
    });

    it('should have correct default upload options', () => {
      expect(defaultUploadOptions).toEqual({
        folder: 'odyssey',
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      });
    });
  });

  describe('Connection Health Check', () => {
    it('should successfully connect to Cloudinary API', async () => {
      const result = await cloudinary.api.ping();
      expect(result.status).toBe('ok');
    }, 10000); // 10 second timeout for API call

    it('should be able to get account details', async () => {
      const result = await cloudinary.api.usage();
      expect(result).toHaveProperty('plan');
      expect(result).toHaveProperty('last_updated');
    }, 10000);
  });

  describe('Upload Functionality', () => {
    it('should upload a test image successfully', async () => {
      // Create a simple test image data URL (1x1 pixel PNG)
      const testImageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      const result = await uploadToCloudinary(testImageDataUrl, {
        public_id: 'test-health-check-image'
      });

      testImagePublicId = result.public_id;

      expect(result).toHaveProperty('public_id');
      expect(result).toHaveProperty('secure_url');
      expect(result.resource_type).toBe('image');
      expect(result.folder).toBe('odyssey');
    }, 15000);

    it('should generate optimized URLs correctly', () => {
      const publicId = 'odyssey/test-image';
      const optimizedUrl = getOptimizedUrl(publicId);
      
      expect(optimizedUrl).toContain(publicId);
      expect(optimizedUrl).toContain('f_auto');
      expect(optimizedUrl).toContain('q_auto');
    });

    it('should generate transformed URLs correctly', () => {
      const publicId = 'odyssey/test-image';
      const transformedUrl = getTransformedUrl(publicId, 300, 300);
      
      expect(transformedUrl).toContain(publicId);
      expect(transformedUrl).toContain('c_auto');
      expect(transformedUrl).toContain('g_auto');
      expect(transformedUrl).toContain('w_300');
      expect(transformedUrl).toContain('h_300');
    });
  });

  describe('Delete Functionality', () => {
    it('should delete uploaded image successfully', async () => {
      if (!testImagePublicId) {
        // Upload a test image first
        const testImageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const uploadResult = await uploadToCloudinary(testImageDataUrl, {
          public_id: 'test-delete-image'
        });
        testImagePublicId = uploadResult.public_id;
      }

      const result = await deleteFromCloudinary(testImagePublicId);
      expect(result.result).toBe('ok');
      
      // Clear the test image ID since it's been deleted
      testImagePublicId = '';
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should handle invalid upload gracefully', async () => {
      await expect(
        uploadToCloudinary('invalid-data-url')
      ).rejects.toThrow();
    });

    it('should handle delete of non-existent image gracefully', async () => {
      const result = await deleteFromCloudinary('non-existent-image-id');
      expect(result.result).toBe('not found');
    });
  });
}); 