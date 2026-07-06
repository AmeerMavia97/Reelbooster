export interface FollowingRecord {
  follow_id: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  follower_id: number;
  User: FollowingUser; 
  isFollowed: boolean;
}

export interface FollowingUser {
    user_name: string;
    email: string;
    profile_pic: string;
    user_id: number;
    full_name: string;
    country_code: string;
    country: string;
    gender: string;
    bio: string;
    profile_verification_status: boolean;
    login_verification_status: boolean;
    updatedAt: string;
    socket_id: string;
  };

export interface FollowingPagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface FollowingRes {
  status: boolean;
  data: {
    Records: FollowingRecord[];
    Pagination: FollowingPagination;
  };
  message: string;
  toast: boolean;
}


// ==================================================================================================
export interface FollowerUser {
  user_name: string;
  email: string;
  profile_pic: string;
  user_id: number;
  full_name: string;
  country_code: string;
  country: string;
  gender: string;
  bio: string;
  profile_verification_status: boolean;
  login_verification_status: boolean;
  updatedAt: string;
  socket_id: string;
}

export interface FollowerRecord {
  follow_id: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  follower_id: number;
  follower: FollowerUser;
  isFollowed: boolean;
}

export interface FollowerPagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface FollowersRes {
  status: boolean;
  data: {
    Records: FollowerRecord[];
    Pagination: FollowerPagination;
  };
  message: string;
  toast: boolean;
}

