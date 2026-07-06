export interface LiveList {
    status:  boolean;
    data:    LiveData;
    message: string;
    toast:   boolean;
}

export interface LiveData {
    Records:    LiveRecord[];
    Pagination: LivePagination;
}

export interface LivePagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface LiveRecord {
    live_id:        number;
    total_viewers:  number;
    curent_viewers: number;
    likes:          number;
    socket_room_id: string;
    comments:       number;
    live_title:     string;
    live_status:    string;
    is_demo:        boolean;
    createdAt:      string;
    updatedAt:      string;
    Live_hosts:     LiveHost[];
}

export interface LiveHost {
    live_host_id: number;
    is_live:      boolean;
    is_main_host: boolean;
    peer_id:      string;
    createdAt:    string;
    updatedAt:    string;
    live_id:      number;
    user_id:      number;
    User:         LiveUser;
    following:    boolean;
}

export interface LiveUser {
    user_name:                   string;
    email:                       string;
    mobile_num:                  string;
    profile_pic:                 string;
    platforms:                   string[];
    user_id:                     number;
    full_name:                   string;
    first_name:                  string;
    last_name:                   string;
    country_code:                string;
    login_type:                  string;
    country:                     string;
    country_short_name:          string;
    profile_verification_status: boolean;
    total_socials:               number;
    blocked_by_admin:            boolean;
    is_deleted:                  boolean;
    createdAt:                   string;
    updatedAt:                   string;
}


// Join Live Event Response =======================================
export interface JoinLive {
  User: JoinUser;
  curent_viewers: number;  // (spelling fixed)
  is_live: boolean;
  likes: number;
  peer_id: JoinPeer[];
  total_viewers: number;
}

export interface JoinUser {
  first_name: string;
  full_name: string;
  last_name: string;
  peer_id: string;
  profile_pic: string;
  user_id: number;
  user_name: string;
}

export interface JoinPeer {
  User: PeerUser;
  createdAt: string;
  is_live: boolean;
  is_main_host: boolean;
  live_host_id: number;
  live_id: number;
  peer_id: string; // this is the m3u8 URL
  updatedAt: string;
  user_id: number;
}


export interface PeerUser {
    blocked_by_admin:boolean
    country:string;
    country_code:string;
    country_short_name:string;
    createdAt:string;
    email:string;
    first_name:string;
    full_name:string;
    is_deleted:boolean;
    last_name:string;
    login_type:string;
    mobile_num:string;
    platforms:string[];
    profile_pic:string;
    profile_verification_status:boolean;
    total_socials:number;
    updatedAt:string;
    user_id:number;
    user_name:string;
}


// Activity on Live Comment Res ===================
export interface ActivityOnLiveComment {
    comment : boolean;
    comment_cotent:string;
    current_like:number;
    first_name:string;
    full_name:string;
    last_name:string;
    like:boolean;
    profile_pic:string;
    total_comments:number;
    user_id:number;
    user_name:string;
}

// Activity on Live Like Res =============================== 
export interface ActivityOnLiveLike {
    comment : boolean;
    comment_cotent:string;
    current_like:number;
    first_name:string;
    full_name:string;
    last_name:string;
    like:boolean;
    profile_pic:string;
    total_comments:number;
    user_id:number;
    user_name:string;
}

// Leave Live Res ===========================
export interface LeaveLive {
    User:LeaveUser;
    current_viewers:number;
    total_viewers:number;
}

export interface LeaveUser {
    first_name:string;
    full_name:string;
    last_name:string;
    peer_id:string;
    profile_pic:string;
    user_id:number;
    user_name:string;
}