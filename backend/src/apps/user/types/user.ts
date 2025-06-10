export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  
  // Profile fields (merged from separate Profile model)
  profileBio?: string;
  profilePicture?: string;
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
}

export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  profileName?: string;
  profileBio?: string;
  profilePicture?: string;
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
  profilePicture?: string;
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
  profilePicture?: string;
  profileBio?: string;
  followersCount?: number;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {} 