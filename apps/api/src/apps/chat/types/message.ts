export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  conversationId?: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageRequest {
  content: string;
  receiverId?: string;
  conversationId?: string;
  messageType?: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
} 