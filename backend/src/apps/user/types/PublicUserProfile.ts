export interface PublicUserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileName?: string;
  profileBio?: string;
  profilePicture?: string; // Cloudinary URL
  profileLocation?: string;
  profileWebsite?: string;
  profilePrivate?: boolean;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
  // Sensitive fields excluded
} 