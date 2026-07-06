export interface CommentList {
    status:  boolean;
    data:    Data;
    message: string;
    toast:   boolean;
}

export interface Data {
    Records:    Record[];
    pagination: Pagination;
}

export interface Record {
    social_id:      number;
    comment_by:     number;
    comment_ref_id: number;
    comment_id:     number;
    comment:        string;
    createdAt:      string;
    updatedAt:      string;
    commenter:      Commenter;
    reply_count:    number;
    like_count:     number;
    isLiked:        number;
}

export interface Commenter {
    user_name:                   string;
    email:                       string;
    mobile_num:                  string;
    profile_pic:                 string;
    dob:                         string;
    intrests:                    Interest[];
    platforms:                   string[];
    user_id:                     number;
    full_name:                   string;
    first_name:                  string;
    last_name:                   string;
    country_code:                string;
    socket_id:                   string;
    gender:                      string;
    country:                     string;
    country_short_name:          string;
    state:                       string;
    city:                        string;
    bio:                         string;
    profile_verification_status: boolean;
    login_verification_status:   boolean;
    is_private:                  boolean;
    is_admin:                    boolean;
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

export interface Pagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}


// take proper response =============================
export interface Interest {
    id:number;
}


// Add comment response ==============
export interface AddCommentResponse {
    status:  boolean;
    data:    Data;
    message: string;
    toast:   boolean;
}

export interface Data {
    social_id:      number;
    comment_by:     number;
    comment_ref_id: number;
    comment_id:     number;
    comment:        string;
    updatedAt:      string;
    createdAt:      string;
}
