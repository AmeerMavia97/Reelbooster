export interface SendMessageData {
  chat_id?: number;
  message_content?: string;
  message?:string;
  message_type?:
    | "image"
    | "video"
    | "text"
    | "location"
    | "document"
    | "audio"
    | "contact"
    | "status"
    | "gif"
    | "poll"
    | "";
  phone_number?: string;
  latitude?: number;
  longitude?: number;
  video_time?: string;
  audio_time?: string;
  forward_id?: number;
  reply_id?: number;
  status_id?: number;
  url?: string;
  thumbnail_url?: string;
  fileName?: string;
  showEmojiPicker?: boolean;
  showAttachmentOptions?: boolean;
  showGifPicker?:boolean;
}