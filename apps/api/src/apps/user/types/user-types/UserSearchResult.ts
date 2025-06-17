export interface UserSearchResult {
  id: string;
  username: string;
  profileName?: string;
  profilePicture?: string; // Cloudinary URL
  profileBio?: string;
  followersCount?: number;
} 