export declare namespace GoodsTypes {
    interface GetGoods {
        _limit: number
        _start: number
        goods_name_contains?: string
    }

    interface Goods {
        id?: number
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

    interface GoodsSku {
        id?: number
        type_1?: string,
        type_2?: string,
        type_3?: string,
        type_1_name?: string,
        type_2_name?: string,
        type_3_name?: string,
        price?: number | string,
        inventory?: number | string,
        sales_volume?: number | string
    }
}