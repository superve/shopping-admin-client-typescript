export declare namespace CategoryTypes {
    interface GetCategory {
        level: number
        _start?: number
        _limit?: number
        category_name_contains?: string
    }

    interface Category {
        id?: number
        category_name?: string
        parent_category?: number | undefined
    }
}