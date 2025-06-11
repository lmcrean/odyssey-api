import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Default upload options with odyssey folder
export const defaultUploadOptions = {
  folder: 'odyssey',
  resource_type: 'auto' as const,
  quality: 'auto',
  fetch_format: 'auto',
};

// Upload function with default folder
export const uploadToCloudinary = async (
  file: string,
  options: any = {}
) => {
  try {
    const mergedOptions = {
      ...defaultUploadOptions,
      ...options,
    };

    const result = await cloudinary.uploader.upload(file, mergedOptions);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Get optimized URL
export const getOptimizedUrl = (publicId: string, options: any = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options,
  });
};

// Get transformed URL (auto-crop to square)
export const getTransformedUrl = (
  publicId: string,
  width: number = 500,
  height: number = 500,
  options: any = {}
) => {
  return cloudinary.url(publicId, {
    crop: 'auto',
    gravity: 'auto',
    width,
    height,
    ...options,
  });
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;
