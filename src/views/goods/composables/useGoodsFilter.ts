import {ref, Ref, unref} from "vue";
import { GoodsTypes } from "../../../../packages/api/types/goodsTypes";

export default function useGoodsFilter(queries: Ref<GoodsTypes.GetGoods>) {
    const filterKeys = ref([
        { key: "", label: "请选择" },
        { key: "id", label: "id" },
        { key: "goods_name", label: "商品名" }
    ])
    
    function handleGoodsFilter(query: Record<string, any>) {
        const queryContains: Record<string, any> = {};
        Object.keys(query).forEach((v: string)=> {
            queryContains[v + "_contains"] = query[v];
        });
        queries.value = {
            _start: 0,
            _limit: unref(queries)._limit,
            ...queryContains
        }
    }

    return {
        filterKeys,
        handleGoodsFilter
    }
}