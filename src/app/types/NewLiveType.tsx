export interface LiveHost {
  live_host_id: number;
  is_live: boolean;
  is_main_host: boolean;
  is_winner: boolean;
  peer_id: string;
  total_gifts: number;
  status: string;
  total_coins: number;
  createdAt: string;
  updatedAt: string;
  live_id: number;
  user_id: number;
}

export interface Live {
  live_id: number;
  total_viewers: number;
  curent_viewers: number;
  likes: number;
  socket_room_id: string;
  comments: number;
  live_title: string;
  live_type: string;
  live_status: string;
  is_demo: boolean;
  battle_start_time: string | null;
  battle_end_time: string | null;
  time: string;
  createdAt: string;
  updatedAt: string;
  Live_hosts: LiveHost[];
}

export interface User {
  user_name: string;
  email: string;
  profile_pic: string;
  platforms: string[];
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  country: string;
  country_short_name: string;
  profile_verification_status: boolean;
  total_socials: number;
  blocked_by_admin: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecordItem {
  live_host_id: number;
  is_live: boolean;
  is_main_host: boolean;
  is_winner: boolean;
  peer_id: string;
  total_gifts: number;
  status: string;
  total_coins: number;
  createdAt: string;
  updatedAt: string;
  live_id: number;
  user_id: number;
  Live: Live;
  User: User;
  following: boolean;
}

export interface Pagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface LiveApiData {
  Records: RecordItem[];
  Pagination: Pagination;
}

export interface LiveApiResponse {
  status: boolean;
  data: LiveApiData;
  message: string;
  toast: boolean;
}
