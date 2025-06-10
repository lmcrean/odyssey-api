export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  
  // Profile fields (merged from separate Profile model)
  profileBio?: string;
  profilePicture?: string; // Cloudinary URL or path
  profileName?: string; // Display name different from username
  profileLocation?: string;
  profileWebsite?: string;
  profileBirthdate?: Date;
  profilePrivate?: boolean; // Private account setting
  
  // Social counts (derived fields)
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileName?: string;
  profileBio?: string;
  profilePicture?: string; // Cloudinary URL
}

export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  profileName?: string;
  profileBio?: string;
  profilePicture?: string; // Cloudinary URL
  profileLocation?: string;
  profileWebsite?: string;
  profileBirthdate?: Date;
  profilePrivate?: boolean;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  profileName?: string;
  profileBio?: string;
  profilePicture?: string; // Cloudinary URL
  profileLocation?: string;
  profileWebsite?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  createdAt: Date;
  lastActiveAt?: Date;
  // Sensitive fields excluded
}

export interface UserSearchResult {
  id: string;
  username: string;
  profileName?: string;
  profilePicture?: string; // Cloudinary URL
  profileBio?: string;
  followersCount?: number;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

// Cloudinary-specific types and validation
export interface CloudinaryImageData {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface ProfilePictureUpload {
  file: File;
  folder?: string; // Cloudinary folder (e.g., 'profile-pictures')
  transformation?: string; // Cloudinary transformation (e.g., 'w_400,h_400,c_fill')
}

// Default profile picture (following Django pattern)
export const DEFAULT_PROFILE_PICTURE = 'media/images/default_profile_dqcubz.jpg';

// Cloudinary validation constants
export const CLOUDINARY_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  PROFILE_FOLDER: 'profile-pictures',
  DEFAULT_TRANSFORMATION: 'w_400,h_400,c_fill,q_auto,f_auto'
} as const; 