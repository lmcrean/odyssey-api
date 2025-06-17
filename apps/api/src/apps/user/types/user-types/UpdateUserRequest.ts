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