// Transaction Conf res ===============================================
export interface TransactionConfRes {
    status:  boolean;
    data:    TransactionConfData;
    message: string;
    toast:   boolean;
}

export interface TransactionConfData {
    Records:    TransactionConfRecord[];
    Pagination: TransactionConfPagination;
}

export interface TransactionConfPagination {
    total_pages:      number;
    total_records:    number;
    current_page:     number;
    records_per_page: number;
}

export interface TransactionConfRecord {
    transaction_conf_id:       number;
    payment_methods:           string;
    tax:                       string;
    admin_margin:              string;
    currency:                  string;
    currency_symbol:           string;
    coin_value_per_1_currency: string;
    transaction_type:          string;
    minimum_transaction:       number;
    welcome_bonus:             number;
    status:                    boolean;
    createdAt:                 string;
    updatedAt:                 string;
}
