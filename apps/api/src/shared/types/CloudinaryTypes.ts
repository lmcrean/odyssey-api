// Shared Cloudinary types for all domains
export interface CloudinaryImageData {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface CloudinaryUploadResult {
  success: boolean;
  data?: CloudinaryImageData;
  error?: string;
}

export interface CloudinaryDeleteResult {
  success: boolean;
  data?: {
    result: string;
  };
  error?: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: any[];
  resource_type?: 'auto' | 'image' | 'video' | 'raw';
  quality?: string | number;
  fetch_format?: string;
}

// Generic file upload interface that can be extended by domains
export interface FileUpload {
  fileData: Buffer | Blob;
  filename: string;
  mimetype: string;
  folder?: string;
  transformation?: string;
} 