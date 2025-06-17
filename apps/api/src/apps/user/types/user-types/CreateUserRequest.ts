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