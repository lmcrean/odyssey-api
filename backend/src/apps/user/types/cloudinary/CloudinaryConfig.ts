// Cloudinary validation constants
export const CLOUDINARY_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
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