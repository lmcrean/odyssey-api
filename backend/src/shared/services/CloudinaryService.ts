import { 
  uploadToCloudinary, 
  getOptimizedUrl, 
  getTransformedUrl, 
  deleteFromCloudinary,
  defaultUploadOptions 
} from '../../../cloudinary.config';

export class CloudinaryService {
  
  /**
   * Upload a file to Cloudinary with default odyssey folder
   * @param file - File path or URL to upload
   * @param options - Additional upload options
   * @returns Promise with upload result
   */
  static async uploadFile(file: string, options: any = {}) {
    try {
      const result = await uploadToCloudinary(file, {
        ...options,
        folder: options.folder || 'odyssey', // Ensure odyssey folder by default
      });
      
      return {
        success: true,
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          url: result.url,
          width: result.width,
          height: result.height,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
        }
      };
    } catch (error) {
      console.error('CloudinaryService - Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Upload profile image with specific transformations
   * @param file - File to upload
   * @param userId - User ID for naming
   * @returns Promise with upload result
   */
  static async uploadProfileImage(file: string, userId: string) {
    return this.uploadFile(file, {
      folder: 'odyssey/profiles',
      public_id: `profile_${userId}_${Date.now()}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
  }

  /**
   * Upload post image
   * @param file - File to upload
   * @param postId - Post ID for naming
   * @returns Promise with upload result
   */
  static async uploadPostImage(file: string, postId?: string) {
    return this.uploadFile(file, {
      folder: 'odyssey/posts',
      public_id: postId ? `post_${postId}_${Date.now()}` : undefined,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
  }

  /**
   * Get optimized URL for an image
   * @param publicId - Public ID of the image
   * @param options - Additional transformation options
   * @returns Optimized URL
   */
  static getOptimizedImageUrl(publicId: string, options: any = {}) {
    return getOptimizedUrl(publicId, options);
  }

  /**
   * Get transformed URL with custom dimensions
   * @param publicId - Public ID of the image
   * @param width - Desired width
   * @param height - Desired height
   * @param options - Additional options
   * @returns Transformed URL
   */
  static getTransformedImageUrl(
    publicId: string, 
    width: number = 500, 
    height: number = 500, 
    options: any = {}
  ) {
    return getTransformedUrl(publicId, width, height, options);
  }

  /**
   * Delete an image from Cloudinary
   * @param publicId - Public ID of the image to delete
   * @returns Promise with deletion result
   */
  static async deleteImage(publicId: string) {
    try {
      const result = await deleteFromCloudinary(publicId);
      return {
        success: result.result === 'ok',
        data: result
      };
    } catch (error) {
      console.error('CloudinaryService - Delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }

  /**
   * Get image info including dimensions and format
   * @param publicId - Public ID of the image
   * @returns Promise with image info
   */
  static async getImageInfo(publicId: string) {
    try {
      const cloudinary = (await import('../../../cloudinary.config')).default;
      const result = await cloudinary.api.resource(publicId);
      
      return {
        success: true,
        data: {
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          url: result.url,
          secure_url: result.secure_url,
          created_at: result.created_at,
        }
      };
    } catch (error) {
      console.error('CloudinaryService - Get info error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get image info'
      };
    }
  }
} 