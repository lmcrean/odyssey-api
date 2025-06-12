// Shared Cloudinary validation constants and utilities
export const CLOUDINARY_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  FOLDERS: {
    PROFILES: 'odyssey/profiles',
    POSTS: 'odyssey/posts',
    CHAT: 'odyssey/chat',
    GENERAL: 'odyssey'
  },
  TRANSFORMATIONS: {
    PROFILE_PICTURE: 'w_400,h_400,c_fill,q_auto,f_auto',
    POST_IMAGE: 'w_1200,h_1200,c_limit,q_auto,f_auto',
    CHAT_IMAGE: 'w_800,h_800,c_limit,q_auto,f_auto'
  },
  // Backward compatibility - these should be deprecated in favor of FOLDERS and TRANSFORMATIONS
  PROFILE_FOLDER: 'profile-pictures',
  DEFAULT_TRANSFORMATION: 'w_400,h_400,c_fill,q_auto,f_auto'
} as const;

// Cloudinary validation utilities
export const CloudinaryValidation = {
  isValidFormat: (format: string): format is typeof CLOUDINARY_CONFIG.ALLOWED_FORMATS[number] => {
    return CLOUDINARY_CONFIG.ALLOWED_FORMATS.includes(format as any);
  },
  
  isValidFileSize: (bytes: number): boolean => {
    return bytes <= CLOUDINARY_CONFIG.MAX_FILE_SIZE;
  },
  
  validateImageFile: (filename: string, bytes: number, mimetype: string) => {
    const format = filename.split('.').pop()?.toLowerCase() || '';
    
    return {
      isValid: CloudinaryValidation.isValidFormat(format) && 
               CloudinaryValidation.isValidFileSize(bytes) &&
               mimetype.startsWith('image/'),
      errors: [
        ...(!CloudinaryValidation.isValidFormat(format) ? [`Invalid format: ${format}. Allowed: ${CLOUDINARY_CONFIG.ALLOWED_FORMATS.join(', ')}`] : []),
        ...(!CloudinaryValidation.isValidFileSize(bytes) ? [`File too large: ${Math.round(bytes / 1024)}KB. Max: ${CLOUDINARY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`] : []),
        ...(!mimetype.startsWith('image/') ? [`Invalid mime type: ${mimetype}`] : [])
      ]
    };
  },

  generatePublicId: (type: 'profile' | 'post' | 'chat', identifier: string): string => {
    const timestamp = Date.now();
    return `${type}_${identifier}_${timestamp}`;
  },

  // Backward compatibility methods - these should be deprecated
  buildTransformationUrl: (publicId: string, transformation?: string): string => {
    const trans = transformation || CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION;
    return `https://res.cloudinary.com/your-cloud-name/image/upload/${trans}/${publicId}`;
  },
  
  buildProfilePictureUrl: (publicId: string): string => {
    return CloudinaryValidation.buildTransformationUrl(
      `${CLOUDINARY_CONFIG.PROFILE_FOLDER}/${publicId}`,
      CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION
    );
  }
} as const; 