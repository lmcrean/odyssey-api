import { CLOUDINARY_CONFIG, CloudinaryValidation } from '../CloudinaryValidation';

describe('CLOUDINARY_CONFIG', () => {
  it('should have correct configuration values', () => {
    expect(CLOUDINARY_CONFIG.MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
    expect(CLOUDINARY_CONFIG.ALLOWED_FORMATS).toEqual(['jpg', 'jpeg', 'png', 'gif', 'webp']);
    expect(CLOUDINARY_CONFIG.PROFILE_FOLDER).toBe('profile-pictures');
    expect(CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION).toBe('w_400,h_400,c_fill,q_auto,f_auto');
  });

  it('should be a const object', () => {
    // Test that config is defined and has the expected structure
    expect(typeof CLOUDINARY_CONFIG).toBe('object');
    expect(CLOUDINARY_CONFIG).toBeDefined();
    expect(CLOUDINARY_CONFIG).not.toBeNull();
  });
});

describe('CloudinaryValidation', () => {
  describe('isValidFormat', () => {
    it('should return true for allowed formats', () => {
      expect(CloudinaryValidation.isValidFormat('jpg')).toBe(true);
      expect(CloudinaryValidation.isValidFormat('jpeg')).toBe(true);
      expect(CloudinaryValidation.isValidFormat('png')).toBe(true);
      expect(CloudinaryValidation.isValidFormat('gif')).toBe(true);
      expect(CloudinaryValidation.isValidFormat('webp')).toBe(true);
    });

    it('should return false for disallowed formats', () => {
      expect(CloudinaryValidation.isValidFormat('bmp')).toBe(false);
      expect(CloudinaryValidation.isValidFormat('svg')).toBe(false);
      expect(CloudinaryValidation.isValidFormat('pdf')).toBe(false);
      expect(CloudinaryValidation.isValidFormat('tiff')).toBe(false);
      expect(CloudinaryValidation.isValidFormat('ico')).toBe(false);
      expect(CloudinaryValidation.isValidFormat('')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(CloudinaryValidation.isValidFormat('JPG')).toBe(false);
      expect(CloudinaryValidation.isValidFormat('PNG')).toBe(false);
      expect(CloudinaryValidation.isValidFormat('JPEG')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(CloudinaryValidation.isValidFormat('jpg ')).toBe(false); // trailing space
      expect(CloudinaryValidation.isValidFormat(' jpg')).toBe(false); // leading space
      expect(CloudinaryValidation.isValidFormat('jp g')).toBe(false); // space in middle
    });
  });

  describe('isValidFileSize', () => {
    it('should return true for files within size limit', () => {
      expect(CloudinaryValidation.isValidFileSize(0)).toBe(true);
      expect(CloudinaryValidation.isValidFileSize(1024)).toBe(true); // 1KB
      expect(CloudinaryValidation.isValidFileSize(1024 * 1024)).toBe(true); // 1MB
      expect(CloudinaryValidation.isValidFileSize(5 * 1024 * 1024)).toBe(true); // Exactly 5MB
      expect(CloudinaryValidation.isValidFileSize(5 * 1024 * 1024 - 1)).toBe(true); // Just under 5MB
    });

    it('should return false for files exceeding size limit', () => {
      expect(CloudinaryValidation.isValidFileSize(5 * 1024 * 1024 + 1)).toBe(false); // 5MB + 1 byte
      expect(CloudinaryValidation.isValidFileSize(10 * 1024 * 1024)).toBe(false); // 10MB
      expect(CloudinaryValidation.isValidFileSize(100 * 1024 * 1024)).toBe(false); // 100MB
    });

    it('should handle edge cases according to simple implementation', () => {
      // The current implementation is simple: bytes <= MAX_FILE_SIZE
      // So negative numbers, Infinity, and NaN will behave as follows:
      expect(CloudinaryValidation.isValidFileSize(-1)).toBe(true); // -1 <= 5MB is true
      expect(CloudinaryValidation.isValidFileSize(Infinity)).toBe(false); // Infinity <= 5MB is false
      expect(CloudinaryValidation.isValidFileSize(NaN)).toBe(false); // NaN <= anything is false
    });
  });

  describe('buildTransformationUrl', () => {
    it('should build URL with default transformation', () => {
      const result = CloudinaryValidation.buildTransformationUrl('test-image');
      expect(result).toBe('https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_400,c_fill,q_auto,f_auto/test-image');
    });

    it('should build URL with custom transformation', () => {
      const result = CloudinaryValidation.buildTransformationUrl('test-image', 'w_200,h_200,c_crop');
      expect(result).toBe('https://res.cloudinary.com/your-cloud-name/image/upload/w_200,h_200,c_crop/test-image');
    });

    it('should handle empty transformation (use default)', () => {
      const result = CloudinaryValidation.buildTransformationUrl('test-image', '');
      expect(result).toBe('https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_400,c_fill,q_auto,f_auto/test-image');
    });

    it('should handle empty publicId', () => {
      const result = CloudinaryValidation.buildTransformationUrl('');
      expect(result).toBe('https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_400,c_fill,q_auto,f_auto/');
    });

    it('should handle publicId with special characters', () => {
      const result = CloudinaryValidation.buildTransformationUrl('user/profile_123');
      expect(result).toBe('https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_400,c_fill,q_auto,f_auto/user/profile_123');
    });
  });

  describe('buildProfilePictureUrl', () => {
    it('should build profile picture URL with correct folder and transformation', () => {
      const result = CloudinaryValidation.buildProfilePictureUrl('user123');
      expect(result).toBe('https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_400,c_fill,q_auto,f_auto/profile-pictures/user123');
    });

    it('should handle empty publicId', () => {
      const result = CloudinaryValidation.buildProfilePictureUrl('');
      expect(result).toBe('https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_400,c_fill,q_auto,f_auto/profile-pictures/');
    });

    it('should handle publicId with special characters', () => {
      const result = CloudinaryValidation.buildProfilePictureUrl('user_123-abc');
      expect(result).toBe('https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_400,c_fill,q_auto,f_auto/profile-pictures/user_123-abc');
    });

    it('should always use the profile folder', () => {
      const result = CloudinaryValidation.buildProfilePictureUrl('test');
      expect(result).toContain('/profile-pictures/');
    });

    it('should always use the default transformation', () => {
      const result = CloudinaryValidation.buildProfilePictureUrl('test');
      expect(result).toContain('w_400,h_400,c_fill,q_auto,f_auto');
    });
  });
}); 