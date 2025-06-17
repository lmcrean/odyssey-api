import { 
  uploadToCloudinary, 
  getOptimizedUrl, 
  getTransformedUrl, 
  deleteFromCloudinary,
  defaultUploadOptions 
} from '../config/cloudinary.config';
import { CloudinaryValidation, CLOUDINARY_CONFIG } from './CloudinaryValidation';
import { CloudinaryImageData, CloudinaryUploadResult, CloudinaryDeleteResult, CloudinaryUploadOptions } from '../types/CloudinaryTypes';

export class CloudinaryService {
  
  /**
   * Upload a file to Cloudinary with default odyssey folder
   * @param file - File path or URL to upload
   * @param options - Additional upload options
   * @returns Promise with upload result
   */
  static async uploadFile(file: string, options: CloudinaryUploadOptions = {}): Promise<CloudinaryUploadResult> {
    try {
      const result = await uploadToCloudinary(file, {
        ...options,
        folder: options.folder || CLOUDINARY_CONFIG.FOLDERS.GENERAL,
      });
      
      return {
        success: true,
        data: {
          publicId: result.public_id,
          secureUrl: result.secure_url,
          url: result.url,
          width: result.width,
          height: result.height,
          format: result.format,
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
  static async uploadProfileImage(file: string, userId: string): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: CLOUDINARY_CONFIG.FOLDERS.PROFILES,
      public_id: CloudinaryValidation.generatePublicId('profile', userId),
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
  static async uploadPostImage(file: string, postId?: string): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: CLOUDINARY_CONFIG.FOLDERS.POSTS,
      public_id: postId ? CloudinaryValidation.generatePublicId('post', postId) : undefined,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
  }

  /**
   * Upload chat image
   * @param file - File to upload
   * @param chatId - Chat ID for naming
   * @returns Promise with upload result
   */
  static async uploadChatImage(file: string, chatId?: string): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: CLOUDINARY_CONFIG.FOLDERS.CHAT,
      public_id: chatId ? CloudinaryValidation.generatePublicId('chat', chatId) : undefined,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
  }

  /**
   * Validate image file before upload
   * @param filename - File name
   * @param bytes - File size in bytes
   * @param mimetype - File mime type
   * @returns Validation result
   */
  static validateImageFile(filename: string, bytes: number, mimetype: string) {
    return CloudinaryValidation.validateImageFile(filename, bytes, mimetype);
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
  static async deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
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
  static async getImageInfo(publicId: string): Promise<CloudinaryUploadResult> {
    try {
      const cloudinary = (await import('../config/cloudinary.config')).default;
      const result = await cloudinary.api.resource(publicId);
      
      return {
        success: true,
        data: {
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          url: result.url,
          secureUrl: result.secure_url,
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