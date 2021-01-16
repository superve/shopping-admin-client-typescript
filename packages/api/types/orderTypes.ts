export declare namespace OrderTypes {
    interface Order {
        id?: number | string
        package_company?: string
        package_number?: string
        order_type?: number | string | Record<string, string>
        out_trade_no?: string
        all_price?: number | string
    }

    interface GetOrders {
        _limit: number
        _start: number
        out_trade_no_contains?: string
        package_company_contains?: string
        package_number_contains?: string
    }
}