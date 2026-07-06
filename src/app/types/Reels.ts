export interface SocialMediaResponse {
  status: boolean;
  data: {
    Records: SocialRecord[];
    Pagination: {
      total_pages: number;
      total_records: number;
      current_page: number;
      records_per_page: number;
    };
  };
  message: string;
  toast: boolean;
}

export interface SocialRecord {
  reel_thumbnail: string;
  social_id: number;
  social_desc: string;
  social_type: string;
  aspect_ratio: string | null;
  video_hight: string | null;
  location: string;
  total_views: number;
  total_saves: number;
  total_shares: number;
  country: string;
  status: boolean;
  hashtag: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  music_id: number;
  user_id: number;
  Media: MediaItem[];
  Music: Music;
  User: User;
  isLiked: boolean;
  isSaved: boolean;
  total_comments: number;
  total_likes: number;
  isFollowing: boolean;
}

export interface MediaItem {
  social_id: number;
  media_location: string;
  media_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Music {
  music_thumbnail: string;
  music_url: string;
  music_id: number;
  music_desc: string;
  music_title: string;
  owner: string;
  status: boolean;
  admin_status: boolean;
  total_use: number;
  total_saves: number;
  total_shares: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  user_name: string;
  profile_pic: string;
  platforms: string[];
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  country: string;
  country_short_name: string;
  profile_verification_status: boolean;
  is_private: boolean;
  total_socials: number;
  blocked_by_admin: boolean;
  createdAt: string;
  updatedAt: string;
}

// Home page Reels =================================================================================
export interface ReelResponse {
  status: boolean;
  data: {
    Records: Reel[];
    Pagination: Pagination;
  };
  message: string;
  toast: boolean;
}

export interface Reel {
  reel_thumbnail: string;
  social_id: number;
  social_desc: string;
  social_type: string;
  aspect_ratio: string | null;
  video_hight: string | null;
  location: string;
  total_views: number;
  total_saves: number;
  total_shares: number;
  country: string;
  status: boolean;
  deleted_by_user: boolean;
  hashtag: string[];
  createdAt: string;
  updatedAt: string;
  music_id: number | null;
  user_id: number;
  Media: Media[];
  Music: ReelMusic | null;
  User: ReelUser;
  total_comments: number;
  total_likes: number;
  isFollowing: boolean;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Media {
  social_id: number;
  media_location: string;
  media_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface ReelMusic {
  music_thumbnail: string;
  music_url: string;
  music_id: number;
  music_desc: string;
  music_title: string;
  owner: string;
  status: boolean;
  admin_status: boolean;
  total_use: number;
  total_saves: number;
  total_shares: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReelUser {
  user_name: string;
  profile_pic: string;
  platforms: string[];
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  country: string;
  country_short_name: string;
  profile_verification_status: boolean;
  is_private: boolean;
  total_socials: number;
  blocked_by_admin: boolean;
  createdAt: string;
  updatedAt: string;
}
