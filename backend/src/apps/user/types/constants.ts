// Default profile picture (following Django pattern)
export const DEFAULT_PROFILE_PICTURE = 'media/images/default_profile_dqcubz.jpg';

// Cloudinary validation constants
export const CLOUDINARY_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  PROFILE_FOLDER: 'profile-pictures',
  DEFAULT_TRANSFORMATION: 'w_400,h_400,c_fill,q_auto,f_auto'
} as const; 