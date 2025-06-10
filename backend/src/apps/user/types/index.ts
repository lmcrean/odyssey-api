// Export all individual types
export * from './User';
export * from './DatabaseUser';
export * from './CreateUserRequest';
export * from './UpdateUserRequest';
export * from './PublicUserProfile';
export * from './UserSearchResult';
export * from './UserWithoutPassword';
export * from './CloudinaryImageData';
export * from './ProfilePictureUpload';
export * from './constants';

// Type aliases for backward compatibility and consistency
export type UpdateUserData = import('./UpdateUserRequest').UpdateUserRequest;
export type PublicProfile = import('./PublicUserProfile').PublicUserProfile; 