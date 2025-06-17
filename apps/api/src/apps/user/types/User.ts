export interface User {
  id: string;
  email: string;
  password: string;
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