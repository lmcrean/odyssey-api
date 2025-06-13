// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  date_joined: string;
}

export interface Profile {
  id: number;
  user: User;
  bio?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

// Post types
export interface Post {
  id: number;
  author: Profile;
  title: string;
  content: string;
  image?: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

// Comment types
export interface Comment {
  id: number;
  author: Profile;
  post: number;
  content: string;
  created_at: string;
  updated_at: string;
}

// Message types
export interface Message {
  id: number;
  sender: Profile;
  receiver: Profile;
  content: string;
  created_at: string;
  is_read: boolean;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
