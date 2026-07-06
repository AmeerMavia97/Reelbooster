// Sign Up ==================================
export interface SignUpRes {
  status: boolean;
  data: {
    token: string;
    user: {
      user_name: string;
      email: string;
      user_id:number;
    };
    newUser: boolean;
  };
  message: string;
  toast: boolean;
}

// VerifyOtp ================================
export interface VerifyOtpRes {
  status: boolean;
  data: {
    token: string;
    user: {
      user_name: string;
      email: string;
      mobile_num: string;
      profile_pic: string;
      id_proof: string;
      selfie: string;
      dob: string;
      intrests: string[];
      platforms: string[];
      user_id: number;
      full_name: string;
      first_name: string;
      last_name: string;
      country_code: string;
      socket_id: string;
      otp: number;
      password: string;
      login_type: string;
      gender: string;
      country: string;
      country_short_name: string;
      state: string;
      city: string;
      bio: string;
      device_token: string;
      profile_verification_status: boolean;
      login_verification_status: boolean;
      is_private: boolean;
      is_admin: boolean;
      available_coins: string;
      account_name: string;
      account_number: string;
      bank_name: string;
      swift_code: string;
      IFSC_code: string;
      total_socials: number;
      blocked_by_admin: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
  toast: boolean;
}

// UpdateUserRes =======================

export interface UpdateUserRes {
  status: boolean;
  data: {
    user_name: string;
    email: string;
    mobile_num: string;
    profile_pic: string;
    id_proof: string;
    selfie: string;
    dob: string;
    intrests: string[];
    platforms: string[];
    user_id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    country_code: string;
    socket_id: string;
    otp: number;
    password: string;
    login_type: string;
    gender: string;
    country: string;
    country_short_name: string;
    state: string;
    city: string;
    bio: string;
    device_token: string;
    profile_verification_status: boolean;
    login_verification_status: boolean;
    is_private: boolean;
    is_admin: boolean;
    available_coins: string;
    account_name: string;
    account_number: string;
    bank_name: string;
    swift_code: string;
    IFSC_code: string;
    total_socials: number;
    blocked_by_admin: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  toast: boolean;
}

// Find User ==================
export interface FindUserRes {
  status: boolean;
  data: UserData;
  message: string;
  toast: boolean;
}

export interface UserRecord {
  user_name: string;
  email: string;
  profile_pic: string;
  updatedAt: string;
  user_id: number;
  full_name: string;
  country_code: string;
  country: string;
  gender: string;
  bio: string;
  profile_verification_status: boolean;
  login_verification_status: boolean;
  is_follow: boolean;
}

export interface Pagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface UserData {
  Records: UserRecord[];
  Pagination: Pagination;
}

// Get Hashtag response ===============================

export type HashtagSocialResponse = {
  status: boolean;
  message: string;
  toast: boolean;
  data: {
    Records: HashtagRecord[];
    Pagination: PaginationInfo;
  };
};

export type HashtagRecord = {
  hashtag_name: string;
  hashtag_id:number;
  total_socials: string; // if this is always a string, keep as string; otherwise use number
  Social: SocialItem[];
};

export type SocialItem = {
  social_id: number;
  social_desc: string;
  reel_thumbnail: string;
  createdAt: string; // ISO date string
};

export type PaginationInfo = {
  total_records: number;
  current_page: number;
  total_pages: number;
};

// suggested accounts res =======================================================
export interface SuggestedUserAccountsRecord {
  user_name: string;
  email: string;
  mobile_num: string;
  profile_pic: string;
  updatedAt: string;
  user_id: number;
  full_name: string;
  country_code: string;
  country: string;
  gender: string;
  bio: string;
  profile_verification_status: boolean;
  login_verification_status: boolean;
  socket_id: string;
  login_type: "email" | "phone" | "social";
  blocked_by_admin: boolean;
  available_coins: string;
  createdAt: string;
}

export interface SuggestedUserAccountsPagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface SuggestedUserResponse {
  status: boolean;
  data: {
    Records: SuggestedUserAccountsRecord[];
    Pagination: SuggestedUserAccountsPagination;
  };
  message: string;
  toast: boolean;
}

// Like-Unlike Response =================================================
export interface LikeUnlikeResponse {
  status: boolean;
  // data:{},
  message: string;
  toast: boolean;
}

// Save-Unsave Response =============================================
export interface SaveUnsaveResponse {
  status: boolean;
  // data:{},
  message: string;
  toast: boolean;
}

// Block-Unblock Response ==============================================
export interface BlockUnblockResponse {
  status: boolean;
  // data:{},
  message: string;
  toast: boolean;
}

// Report Types Response ================================================
export interface ReportType {
  status: boolean;
  data: ReportData;
  message: string;
  toast: boolean;
}

export interface ReportData {
  ReportTypes: ReportTypeData[];
}

export interface ReportTypeData {
  report_type_id: number;
  report_text: string;
  report_for: string;
  createdAt: string;
  updatedAt: string;
}

// Send Report Type ===========================================
export interface SendReportRes {
  status: boolean;
  // data:{};
  message: string;
  toast: boolean;
}

// Send Message Type =========================================
export interface SendMessageRes {
  status: boolean;
  // data:{}
  message: string;
  toast: boolean;
}

// Blocked List Response ======================================

export interface BlockedList {
  status: boolean;
  data: BlockedData;
  message: string;
  toast: boolean;
}

export interface BlockedData {
  Records: BlockRecord[];
  Pagination: BlockedListPagination;
}

export interface BlockedListPagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface BlockRecord {
  block_id: number;
  approved: boolean;
  createdAt: string; // keep as string, not Date
  updatedAt: string;
  user_id: number;
  blocked_id: number;
  blocked: BlockedUser;
}

export interface BlockedUser {
  user_name: string;
  email: string;
  mobile_num: string;
  profile_pic: string;
  id_proof: string;
  selfie: string;
  dob: string;
  intrests: string[];
  platforms: string[];
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  country_code: string;
  socket_id: string;
  otp: number;
  password: string;
  login_type: string;
  gender: string;
  country: string;
  country_short_name: string;
  state: string;
  city: string;
  bio: string;
  device_token: string;
  profile_verification_status: boolean;
  login_verification_status: boolean;
  is_private: boolean;
  is_admin: boolean;
  available_coins: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  swift_code: string;
  IFSC_code: string;
  total_socials: number;
  blocked_by_admin: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Save List Response ==============================================================================
export interface SavedList {
  status: boolean;
  data: SavedData;
  message: string;
  toast: boolean;
}

export interface SavedData {
  Records: SaveListRecord[];
  Pagination: SavedListPagination;
}

export interface SavedListPagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface SaveListRecord {
  save_by: number;
  social_id: number;
  Social: SaveListSocial;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  total_comments: number;
  total_likes: number;
  total_saves: number;
}

export interface SaveListSocial {
  reel_thumbnail: string;
  social_id: number;
  social_desc: string;
  social_type: string;
  aspect_ratio: string;
  video_hight: string;
  location: string;
  total_views: number;
  total_saves: number;
  total_shares: number;
  country: string;
  status: boolean;
  deleted_by_user: boolean;
  hashtag: null;
  createdAt: string;
  updatedAt: string;
  music_id: number;
  user_id: number;
  Media: SaveListMedia[];
  Music: SaveListMusic;
  User: SaveListUser;
}

export interface SaveListMedia {
  social_id: number;
  media_location: string;
  media_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaveListMusic {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveListUser {
  user_name: string;
  profile_pic: string;
  intrests: string[];
  platforms: string[];
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  socket_id: string;
  country: string;
  country_short_name: string;
  profile_verification_status: boolean;
  available_coins: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  swift_code: string;
  IFSC_code: string;
  total_socials: number;
  blocked_by_admin: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Project Config Response ==============================================================
export interface ProjectConfigRes {
    status:  boolean;
    data:    ProjectConfigData;
    message: string;
    toast:   boolean;
}

export interface ProjectConfigData {
    app_logo_light:              string;
    app_logo_dark:               string;
    splash_image:                string;
    one_signal_api_key:          string;
    android_channel_id:          string;
    web_logo_light:              string;
    web_logo_dark:               string;
    twilio_account_sid:          string;
    twilio_auth_token:           string;
    msg_91_auth_key:             string;
    msg_91_private_key:          string;
    msg_91_template_id:          string;
    twilio_phone_number:         string;
    password:                    string;
    email_banner:                string;
    config_id:                   number;
    phone_authentication:        boolean;
    email_authentication:        boolean;
    maximum_members_in_group:    number;
    show_all_contatcts:          boolean;
    show_phone_contatcs:         boolean;
    one_signal_app_id:           string;
    app_name:                    string;
    app_email:                   string;
    app_text:                    string;
    app_primary_color:           string;
    app_secondary_color:         string;
    app_ios_link:                string;
    app_android_link:            string;
    app_tell_a_friend_text:      string;
    email_service:               string;
    smtp_host:                   string;
    email:                       string;
    email_port:                  string;
    email_title:                 string;
    purchase_code:               string;
    copyright_text:              string;
    privacy_policy:              string;
    terms_and_conditions:        string;
    delete_account:              string;
    s3_region:                   string;
    s3_access_key_id:            string;
    s3_secret_access_key:        string;
    s3_bucket_name:              string;
    mediaflow:                   string;
    stripe:                      boolean;
    stripe_public_key:           string;
    stripe_secret_key:           string;
    gpay:                        boolean;
    gpay_merch_id:               string;
    gpay_merch_name:             string;
    gpay_country_code:           string;
    gpay_currency_code:          string;
    apple_pay:                   boolean;
    apple_pay_merch_id:          string;
    apple_pay_merch_name:        string;
    apple_pay_country_code:      string;
    apple_pay_currency_code:     string;
    paypal:                      boolean;
    paypal_public_key:           string;
    paypal_secret_key:           string;
    google_login_authentication: boolean;
    apple_login_authentication:  boolean;
    is_extended:                 boolean;
    is_demo:                     boolean;
    isRechargeEnable:            boolean;
    createdAt:                   string;
    updatedAt:                   string;
}


// Music List Res =========================================================

export interface MusicListResponse {
    status:  boolean;
    data:    MusicData;
    message: string;
    toast:   boolean;
}

export interface MusicData {
    Records:    MusicRecord[];
    Pagination: MusicPagination;
}

export interface MusicPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface MusicRecord {
    music_thumbnail: string;
    music_url:       string;
    music_id:        number;
    music_desc:      string;
    music_title:     string;
    owner:           string;
    status:          boolean;
    admin_status:    boolean;
    total_use:       number;
    total_saves:     number;
    total_shares:    number;
    createdAt:       string;
    updatedAt:       string;
}


// Upload Social Response =========================
export interface UploadSocialRes {
  status:boolean;
  // data:{}
  message:string;
  toast:boolean;
}

// Delete Social Response ============================
export interface DeleteSocialRes {
  status:boolean;
  // data:{}
  message:string;
  toast:boolean;
}

// Get User Not Following response ==============================
export interface UserNotFollowing {
    status:  boolean;
    data:    UserNotFollowingData;
    message: string;
    toast:   boolean;
}

export interface UserNotFollowingData {
    Records:    UserNotFollowingRecord[];
    Pagination: UserNotFollowingPagination;
}

export interface UserNotFollowingPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface UserNotFollowingRecord {
    user_name:                   string;
    email:                       string;
    mobile_num:                  string;
    profile_pic:                 string;
    updatedAt:                   string;
    user_id:                     number;
    full_name:                   string;
    country_code:                string;
    country:                     string;
    gender:                      string;
    bio:                         string;
    profile_verification_status: boolean;
    login_verification_status:   boolean;
    socket_id:                   string;
    login_type:                  string;
    blocked_by_admin:            boolean;
    available_coins:             string;
    createdAt:                   string;
    Socials:                     UserNotFollowingSocial[];
}

export interface UserNotFollowingSocial {
    reel_thumbnail:  string;
    social_id:       number;
    social_desc:     string;
    social_type:     string;
    aspect_ratio:    string;
    video_hight:     string;
    location:        string;
    total_views:     number;
    total_saves:     number;
    total_shares:    number;
    country:         string;
    status:          boolean;
    deleted_by_user: boolean;
    hashtag:         string[] | null;
    createdAt:       string;
    updatedAt:       string;
    music_id:        number | null;
    user_id:         number;
    Media:           UserNotFollowingMedia[];
}

export interface UserNotFollowingMedia {
  social_id:number;
  media_location:string,
  media_id : number,
  createdAt:string;
  updatedAt:string
}

// Like List response ======================================
export interface LikeListRes {
    status:  boolean;
    data:    LikeListData;
    message: string;
    toast:   boolean;
}

export interface LikeListData {
    Records:    LikeListRecord[];
    Pagination: Pagination;
}

export interface LikeListPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface LikeListRecord {
    like_by:        number;
    social_id:      number;
    comment_id:     null;
    Social:         LikeListSocial;
    isLiked:        boolean;
    isSaved:        boolean;
    isFollowing:    boolean;
    total_comments: number;
    total_likes:    number;
    total_saves:    number;
}

export interface LikeListSocial {
    reel_thumbnail:  string;
    social_id:       number;
    social_desc:     string;
    social_type:     string;
    aspect_ratio:    string;
    video_hight:     string;
    location:        string;
    total_views:     number;
    total_saves:     number;
    total_shares:    number;
    country:         string;
    status:          boolean;
    deleted_by_user: boolean;
    hashtag:         string[];
    createdAt:       string;
    updatedAt:       string;
    music_id:        number;
    user_id:         number;
    Media:           LikeListMedia[];
    User:            User;
}

export interface LikeListMedia {
    social_id:      number;
    media_location: string;
    media_id:       number;
    createdAt:      string;
    updatedAt:      string;
}

export interface User {
    user_name:                   string;
    profile_pic:                 string;
    intrests:                    string[];
    platforms:                   string[];
    user_id:                     number;
    full_name:                   string;
    first_name:                  string;
    last_name:                   string;
    socket_id:                   string;
    country:                     string;
    country_short_name:          string;
    profile_verification_status: boolean;
    available_coins:             string;
    account_name:                string;
    account_number:              string;
    bank_name:                   string;
    swift_code:                  string;
    IFSC_code:                   string;
    total_socials:               number;
    blocked_by_admin:            boolean;
    is_deleted:                  boolean;
    createdAt:                   string;
    updatedAt:                   string;
}

// payment intent response =================================================
export interface PaymentIntentResponse {
    status:  boolean;
    data:    PaymentIntentData;
    message: string;
    toast:   boolean;
}

export interface PaymentIntentData {
    clientSecret: string;
}



// viewstreaming


export interface ViewstreamingRes {
    status:  boolean;
    data:    Data;
    message: string;
    toast:   boolean;
}

export interface Data {
    Records:    Record[];
    Pagination: Pagination;
}

export interface Pagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface Live {
    live_id:           number;
    total_viewers:     number;
    curent_viewers:    number;
    likes:             number;
    socket_room_id:    string;
    comments:          number;
    live_title:        string;
    live_type:         string;
    live_status:       string;
    is_demo:           boolean;
    battle_start_time: null;
    battle_end_time:   null;
    time:              string;
    createdAt:         Date;
    updatedAt:         Date;
    Live_hosts:        Record[];
}

export interface Record {
    live_host_id: number;
    is_live:      boolean;
    is_main_host: boolean;
    is_winner:    boolean;
    peer_id:      string;
    total_gifts:  number;
    status:       string;
    total_coins:  number;
    createdAt:    Date;
    updatedAt:    Date;
    live_id:      number;
    user_id:      number;
    Live?:        Live;
    User?:        User;
    following?:   boolean;
}

export interface User {
    user_name:                   string;
    email:                       string;
    profile_pic:                 string;
    platforms:                   string[];
    user_id:                     number;
    full_name:                   string;
    first_name:                  string;
    last_name:                   string;
    country:                     string;
    country_short_name:          string;
    profile_verification_status: boolean;
    total_socials:               number;
    blocked_by_admin:            boolean;
    is_deleted:                  boolean;
    createdAt:                   string;
    updatedAt:                   string;
}



export interface GiftResponceAll {
    status:  boolean;
    data:    Data;
    message: string;
    toast:   boolean;
}

export interface Data {
    Records:    Record[];
    Pagination: Pagination;
}

export interface Pagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface Record {
    gift_thumbnail:   string;
    gift_id:          number;
    name:             string;
    gift_value:       number;
    total_use:        number;
    status:           string;
    createdAt:        Date;
    updatedAt:        Date;
    uploader_id:      number;
    gift_category_id: number;
    Gift_category:    GiftCategory;
}

export interface GiftCategory {
    gift_category_id: number;
    name:             string;
    status:           boolean;
    admin_status:     boolean;
    createdAt:        Date;
    updatedAt:        Date;
    uploader_id:      number;
}