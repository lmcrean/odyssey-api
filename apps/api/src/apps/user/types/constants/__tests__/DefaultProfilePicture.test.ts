import { DEFAULT_PROFILE_PICTURE } from '../DefaultProfilePicture';

describe('DEFAULT_PROFILE_PICTURE', () => {
  it('should be a valid path string', () => {
    expect(DEFAULT_PROFILE_PICTURE).toBe('media/images/default_profile_dqcubz.jpg');
    expect(typeof DEFAULT_PROFILE_PICTURE).toBe('string');
    expect(DEFAULT_PROFILE_PICTURE.length).toBeGreaterThan(0);
  });

  it('should have correct file extension', () => {
    expect(DEFAULT_PROFILE_PICTURE).toMatch(/\.(jpg|jpeg|png|gif|webp)$/);
  });

  it('should be in media/images directory', () => {
    expect(DEFAULT_PROFILE_PICTURE).toMatch(/^media\/images\//);
  });

  it('should not have leading slash (relative path)', () => {
    expect(DEFAULT_PROFILE_PICTURE).not.toMatch(/^\//);
  });

  it('should not have trailing slash', () => {
    expect(DEFAULT_PROFILE_PICTURE).not.toMatch(/\/$/);
  });

  it('should contain the expected filename', () => {
    expect(DEFAULT_PROFILE_PICTURE).toContain('default_profile_dqcubz.jpg');
  });

  it('should be immutable', () => {
    // This is more of a TypeScript compile-time check, but we can verify it's a string
    const originalValue = DEFAULT_PROFILE_PICTURE;
    // In JavaScript, strings are immutable, so this test mainly ensures it's not an array or object
    expect(typeof DEFAULT_PROFILE_PICTURE).toBe('string');
    expect(DEFAULT_PROFILE_PICTURE).toBe(originalValue);
  });

  it('should be suitable for use in HTML img src attribute', () => {
    // Should not contain characters that would break HTML
    expect(DEFAULT_PROFILE_PICTURE).not.toContain('<');
    expect(DEFAULT_PROFILE_PICTURE).not.toContain('>');
    expect(DEFAULT_PROFILE_PICTURE).not.toContain('"');
    expect(DEFAULT_PROFILE_PICTURE).not.toContain("'");
  });

  it('should be a valid file path format', () => {
    // Should contain forward slashes (web-style paths)
    expect(DEFAULT_PROFILE_PICTURE).toContain('/');
    // Should not contain backslashes (Windows-style paths)
    expect(DEFAULT_PROFILE_PICTURE).not.toContain('\\');
    // Should not contain spaces or special characters that might cause issues
    expect(DEFAULT_PROFILE_PICTURE).not.toContain(' ');
    expect(DEFAULT_PROFILE_PICTURE).not.toContain('#');
    expect(DEFAULT_PROFILE_PICTURE).not.toContain('?');
  });
}); 