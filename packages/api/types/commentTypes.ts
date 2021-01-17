export declare namespace CommentTypes {
    // 针对订单的评论无需分页
    interface GetComments {
        _start?: number 
        _limit?: number
        order?: number | string,
        level: number
    }

    interface Comment {
        id?: number
        content?: string
        goods_media?: Array<number | any>
        parent_comment?: number 
        order?: number
        blocked?: boolean

        sku?: number
    }
}