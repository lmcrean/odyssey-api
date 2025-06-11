export interface ProfilePictureUpload {
  fileData: Buffer | Blob; // Works in both Node.js and browser
  filename: string;
  mimetype: string;
  folder?: string; // Cloudinary folder (e.g., 'profile-pictures')
  transformation?: string; // Cloudinary transformation (e.g., 'w_400,h_400,c_fill')
} 