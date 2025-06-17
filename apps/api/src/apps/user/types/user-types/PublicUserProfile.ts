import { User } from '../User';

// Public profile excludes sensitive fields (password, email)
export type PublicUserProfile = Omit<User, 'password' | 'email'>;

// Additional utility types for public profiles
export type PublicUserSummary = Pick<PublicUserProfile, 'id' | 'username' | 'profileName' | 'profilePicture'>;

export type PublicUserDetails = PublicUserProfile & {
  // Computed fields that might be added on the frontend
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  mutualFollowersCount?: number;
}; 