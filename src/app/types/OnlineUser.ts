export interface OnlineUserRes {
  onlineUsers: OnlineUsers[];
}

export interface OnlineUsers {
  user_id: number;
  user_name: string;
  full_name: string;
  email: string;
  mobile_num: string;
  country: string;
  country_code: string;
  state: string;
  city: string;
  dob: string;
  gender: string;
  bio: string;
  profile_pic: string;
  isOnline: boolean;
  is_admin: boolean;
  is_private: boolean;
  profile_verification_status: boolean;
  login_verification_status: boolean;
  login_type: "phone" | "email" | string;
  socket_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfflineUserRes {
  offlineUsers: OfflineUsers;
}

export interface OfflineUsers {
  user_id: number;
}

// Message Seen Status Event Res
export interface MessagesSeenStatus {
  chat_id: number;
  createdAt: string;
  deleted_for: [];
  deleted_for_everyone: false;
  message_content: string;
  message_id: number;
  message_length: string;
  message_seen_status: string;
  message_size: string;
  message_type: string;
  reply_to: number;
  sender_id: number;
  social_id: number;
  updatedAt: string;
}
