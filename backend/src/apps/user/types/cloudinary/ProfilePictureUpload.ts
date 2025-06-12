import { FileUpload } from '../../../../shared/types/CloudinaryTypes';

// User-specific profile picture upload interface
export interface ProfilePictureUpload extends FileUpload {
  userId: string;
} 