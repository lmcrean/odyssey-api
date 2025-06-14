// Export core User entity
export * from './User';

// Export user-related types and requests
export * from './user-types/CreateUserRequest';
export * from './user-types/UpdateUserRequest';
export * from './user-types/PublicUserProfile';
export * from './user-types/UserSearchResult';

// Export Cloudinary-related types and utilities
// Re-export Cloudinary configuration for backward compatibility
export { CLOUDINARY_CONFIG, CloudinaryValidation } from '../../../shared/services/CloudinaryValidation';

// Export constants
export * from './constants/DefaultProfilePicture';

// Utility types derived from User
export type UserWithoutPassword = Omit<import('./User').User, 'password'>;

// Type aliases for backward compatibility and consistency
export type UpdateUserData = import('./user-types/UpdateUserRequest').UpdateUserRequest;
export type PublicProfile = import('./user-types/PublicUserProfile').PublicUserProfile; 