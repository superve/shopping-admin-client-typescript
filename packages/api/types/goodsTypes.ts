export declare namespace GoodsTypes {
    interface GetGoods {
        _limit: number
        _start: number
        goods_name_contains?: string
    }

    interface CreateGoods {
        goods_name: string
        purchasing_price: number
        sales_price: number
        inventory: number // 总库存
        sales_inventory: number // 可销售数量
        goods_media: Array<number>,
        description: string,
        is_sale: boolean,
        goods_number?: number,
        saled_at: Date,
        skus: Array<any>
    }
}