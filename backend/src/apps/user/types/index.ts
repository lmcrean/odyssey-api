export * from './user';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  // Profile fields -- moved to profileFields in camelCase (profilePicture, profileBio, profileLocation, profileWebsite)
  // avatar?: string; avatar is now profilePicture
  // bio?: string; bio is now profileBio
  // location?: string; location is now profileLocation
  // website?: string; website is now profileWebsite
  profileName?: string;
  profilePicture?: string;
  profileBio?: string;
  profileLocation?: string;
  profileWebsite?: string;
  profileBirthdate?: Date;
  profilePrivate?: boolean;
  
  // Social counts
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// Database user includes password for auth operations
export interface DatabaseUser extends User {
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  profileName?: string;
  profilePicture?: string;
  profileBio?: string;
  profileLocation?: string;
  profileWebsite?: string;
  profileBirthdate?: Date;
  profilePrivate?: boolean;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

export interface PublicProfile {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  profileName?: string;
  profilePicture?: string;
  profileBio?: string;
  profileLocation?: string;
  profileWebsite?: string;
  profilePrivate?: boolean;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  createdAt: Date;
  updatedAt: Date;
} 