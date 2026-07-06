
export interface ChatListRes {
    Chats: ChatList[]
    Pagination:Pagination
}

export interface ChatList {
    PeerUserData:PeerUserData
    Records:Record[]
}

export interface PeerUserData {
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

export interface Record {
    Messages:Messages[]
    chat_id:number;
    chat_type:string;
    createdAt:string;
    group_icon:string;
    group_name:string;
    unseen_count:number;
    updatedAt:string;
}

export interface Messages {
    Social:Social; 
    User:User;
    deleted_for:[];
    delete_for_everyone:boolean;
    message_content:string;
    message_id:number;
    message_length:string;
    message_seen_status:string;
    message_size:string;
    message_type:string;
    reply_to:number;
    sender_id:number;
    social_id:number;
    updatedAt:string;
}

export interface Social {
    social_id:number
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


export interface Pagination 
{
    current_page:number;
    records_per_page:number;
    total_pages:number;
    total_records:number
}