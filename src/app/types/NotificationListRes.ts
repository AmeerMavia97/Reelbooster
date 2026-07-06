export interface Notification {
    status:  boolean;
    data:    NotificationData;
    message: string;
    toast:   boolean;
}

export interface NotificationData {
    Records:    Record[];
    Pagination: NotificationPagination;
}

export interface NotificationPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface Record {
    notification_id:          number;
    notification_title:       string;
    notification_description: NotificationDescription;
    notification_type:        string;
    view_status:              string;
    createdAt:                string;
    updatedAt:                string;
    gift_id:                  null;
    sender_id:                number;
    reciever_id:              number;
    social_id:                number | null;
    notification_sender:      NotificationSender;
    Gift:                     null;
    Social:                   Social | null;
}

export interface Social {
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
    music_id:        null;
    user_id:         number;
    Media:           Media[];
    Music?:          null;
    User?:           User;
}

export interface Media {
    social_id:      number;
    media_location: string;
    media_id:       number;
    createdAt:      string;
    updatedAt:      string;
}

export interface User {
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
    login_verification_status:   boolean;
    is_private:                  boolean;
    total_socials:               number;
    blocked_by_admin:            boolean;
    is_deleted:                  boolean;
    createdAt:                   string;
    updatedAt:                   string;
}

export interface NotificationDescription {
    user_pic?:    string;
    user_name?:   string;
    full_name?:   string;
    social?:      Social;
    description:  string;
    user_id?:     number;
    social_id?:   number;
    social_type?: string;
    follower_id?: number;
}

export interface NotificationSender {
    user_name:   string;
    profile_pic: string;
    user_id:     number;
    full_name:   string;
}
