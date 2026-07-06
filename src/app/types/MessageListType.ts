export interface MessageListRes {
  Records: MessageRecord[];
  Pagination: Pagination;
}

export interface Pagination {
  current_page: number;
  records_per_page: number;
  total_pages: number;
  total_records: number;
}

export interface MessageRecord {
  message_content: string;
  reply_to: number;
  social_id: number;
  message_id: number;
  message_type: string;
  ParentMessage: [];
  Replies: [];
  Social: Social;
  User: User;
  chat_id: number;
  createdAt: string; // ISO date string
  deleted_for: [];
  deleted_for_everyone: boolean;
  message_length: string;
  message_seen_status: string;
  message_size: string;
  message_thumbnail: string;
  sender_id: number;
  updatedAt: string; // ISO date string
}

export interface Social {
  aspect_ratio: string;
  country: string;
  createdAt: string;
  deleted_by_user: boolean;
  hashtag: string;
  location: string;
  music_id: number;
  reel_thumbnail: string;
  social_desc: string;
  social_id: number;
  social_type: string;
  status: boolean;
  total_saves: number;
  total_views: number;
  updatedAt: string;
  user_id: number;
  video_height: string;
}

export interface User {
  user_id: number;
  full_name: string;
  user_name: string;
  email: string;
  gender: string;
  bio: string;
  country: string;
  country_code: string;
  profile_pic: string;
  profile_verification_status: boolean;
  login_verification_status: boolean;
  socket_id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
