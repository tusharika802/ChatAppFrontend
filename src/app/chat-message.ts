export interface ChatMessage {
  userId: string;
  text?: string;
  room?: string;
  type?: 'file' | 'join' | 'system';
  action?: 'deleteFile' | 'system' | string;
  url?: string;
  filename: string;
  originalName: string;
  seen?: boolean;
}
