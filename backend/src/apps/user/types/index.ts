// Export all types from user.ts
export * from './user';

// Type aliases for backward compatibility and consistency
export type UpdateUserData = import('./user').UpdateUserRequest;
export type PublicProfile = import('./user').PublicUserProfile; 