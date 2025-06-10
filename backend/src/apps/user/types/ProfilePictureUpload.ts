export interface ProfilePictureUpload {
  file: File;
  folder?: string; // Cloudinary folder (e.g., 'profile-pictures')
  transformation?: string; // Cloudinary transformation (e.g., 'w_400,h_400,c_fill')
} 