export declare namespace OrderTypes {
    interface GetOrders {
        _limit: number
        _start: number
        out_trade_no_contains?: string
        package_company_contains?: string
        package_number_contains?: string
    }
}