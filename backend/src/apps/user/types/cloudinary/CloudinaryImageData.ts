// Cloudinary-specific types and validation
export interface CloudinaryImageData {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
} 