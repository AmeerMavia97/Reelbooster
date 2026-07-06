// Gift Category Response ==========================================

export interface GiftCategoryRes {
    status:  boolean;
    data:    GiftCategoryData;
    message: string;
    toast:   boolean;
}

export interface GiftCategoryData {
    Records:    GiftCategoryRecord[];
    Pagination: GiftCategoryPagination;
}

export interface GiftCategoryPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface GiftCategoryRecord {
    gift_category_id: number;
    name:             string;
    status:           boolean;
    admin_status:     boolean;
    createdAt:        string;
    updatedAt:        string;
    uploader_id:      number;
    count:            number;
}


// Get Gift details Response =========================================
export interface GetGiftResponse {
    status:  boolean;
    data:    GetGiftData;
    message: string;
    toast:   boolean;
}

export interface GetGiftData {
    Records:    GetGiftRecord[];
    Pagination: GetGiftPagination;
}

export interface GetGiftPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface GetGiftRecord {
    gift_thumbnail:   string;
    gift_id:          number;
    name:             string;
    gift_value:       number;
    total_use:        number;
    status:           boolean;
    createdAt:        string;
    updatedAt:        string;
    uploader_id:      number;
    gift_category_id: number;
    Gift_category:    GiftCategory;
}

export interface GiftCategory {
    gift_category_id: number;
    name:             string;
    status:           boolean;
    admin_status:     boolean;
    createdAt:        string;
    updatedAt:        string;
    uploader_id:      number;
}

// Send Gift response ===================================
export interface SendGiftRes {
    status:  boolean;
    // data:    Data;
    message: string;
    toast:   boolean;
}

// get transaction plan response ===============================
export interface TransactionPlan {
    status:  boolean;
    data:    TransactionPlanData;
    message: string;
    toast:   boolean;
}

export interface TransactionPlanData {
    Records:    TransactionPlanRecord[];
    Pagination: TransactionPlanPagination;
}

export interface TransactionPlanPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface TransactionPlanRecord {
    plan_id:             number;
    plan_name:           string;
    coins:               number;
    corresponding_money: number;
    currency:            string;
    currency_symbol:     string;
    status:              boolean;
    transaction_type:    string;
    createdAt:           string;
    updatedAt:           string;
}

// Recharge Response =====================
export interface RechargeResponse {
    status:  boolean;
    // data:    Data;
    message: string;
    toast:   boolean;
}

// Received Gift Response transaction history =======================
export interface RecievedGiftRes {
    status:  boolean;
    data:    RecievedGiftData;
    message: string;
    toast:   boolean;
}

export interface RecievedGiftData {
    Records:    RecievedGiftRecord[];
    Pagination: RecievedGiftPagination;
}

export interface RecievedGiftPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface RecievedGiftRecord {
    transaction_id:  number;
    coin:            string;
    success:         string;
    gift_value:      number;
    quantity:        number;
    transaction_ref: string;
    createdAt:       string;
    updatedAt:       string;
    sender_id:       number;
    reciever_id:     number;
    gift_id:         number;
    social_id:       number;
    sender:          Reciever;
    reciever:        Reciever;
    Gift:            RecievedGift;
}

export interface RecievedGift {
    gift_thumbnail:   string;
    gift_id:          number;
    name:             string;
    gift_value:       number;
    total_use:        number;
    status:           boolean;
    createdAt:        string;
    updatedAt:        string;
    uploader_id:      number;
    gift_category_id: number;
}

export interface Reciever {
    user_name:       string;
    email:           string;
    profile_pic:     string;
    user_id:         number;
    first_name:      string;
    last_name:       string;
    is_admin:        boolean;
    is_private:      boolean;
    available_coins: string;
    full_name:       string;
}


// Coin history res =============================
export interface CoinHistoryRes {
    status:  boolean;
    data:    CoinHistoryData;
    message: string;
    toast:   boolean;
}

export interface CoinHistoryData {
    Records:    CoinHistoryRecord[];
    Pagination: CoinHistoryPagination;
}

export interface CoinHistoryPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface CoinHistoryRecord {
    transaction_id:  number;
    coin:            string;
    success:         string;
    gift_value:      number;
    quantity:        number;
    transaction_ref: string;
    createdAt:       string;
    updatedAt:       string;
    sender_id:       number;
    reciever_id:     number;
    gift_id:         number;
    social_id:       number;
    sender:          Reciever;
    reciever:        Reciever;
    Gift:            CoinHistoryGift;
}

export interface CoinHistoryGift {
    gift_thumbnail:   string;
    gift_id:          number;
    name:             string;
    gift_value:       number;
    total_use:        number;
    status:           boolean;
    createdAt:        string;
    updatedAt:        string;
    uploader_id:      number;
    gift_category_id: number;
}

export interface CoinHistoryReciever {
    user_name:       string;
    email:           string;
    profile_pic:     string;
    user_id:         number;
    first_name:      string;
    last_name:       string;
    is_admin:        boolean;
    is_private:      boolean;
    available_coins: string;
    full_name:       string;
}


// Payment History Res ==============================
export interface PaymentHistoryRes {
    status:  boolean;
    data:    PaymentHistoryData;
    message: string;
    toast:   boolean;
}

export interface PaymentHistoryData {
    Records:    PaymentHistoryRecord[];
    Pagination: PaymentHistoryPagination;
}

export interface PaymentHistoryPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface PaymentHistoryRecord {
    transaction_id:         number;
    payment_method:         string;
    acutal_money:           number;
    available_money:        string;
    coin:                   string;
    success:                string;
    transaction_type:       string;
    coin_price:             string;
    past_coin:              string;
    new_available_coin:     string;
    currency:               string;
    tax:                    number;
    admin_margin:           number;
    transaction_id_gateway: string;
    transaction_email:      string;
    createdAt:              string;
    updatedAt:              string;
    user_id:                number;
    plan_id:                null;
    User:                   User;
}

export interface User {
    user_name:       string;
    email:           string;
    profile_pic:     string;
    user_id:         number;
    first_name:      string;
    last_name:       string;
    is_admin:        boolean;
    is_private:      boolean;
    available_coins: string;
    full_name:       string;
}

// Withdraw Res ==================================
export interface WithdrawRes {
    status:boolean;
    // data:{};
    message:string;
    toast:boolean;
}

