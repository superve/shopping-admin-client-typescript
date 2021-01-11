import { ref, unref, onMounted, watch } from "vue";
import { GoodsTypes } from "../../../../packages/api/types/goodsTypes";
import goodsApi from "../../../../packages/api/goods";

export default function useGoods(){
    const goodsData = ref<any>([]);
    const total = ref<number>(0);
    const queries = ref<GoodsTypes.GetGoods>({
        _start: 0,
        _limit: 5
    });

    async function fetchGoods() {
        const _queries = unref(queries);
        const result = await goodsApi.getGoods(_queries);
        if(Array.isArray(result)) {
            goodsData.value = result.map((v: any) => {
                v.key = v.id;
                return v;
            });
        }
    }

    async function fetchGoodsCount() {
        const {_start, _limit, ..._queries} = queries.value;
        const result = await goodsApi.getGoodsCount(_queries);
        if(typeof result === "number") {
            total.value = result;
        }
    }

    onMounted(() => {
        fetchGoods();
        fetchGoodsCount();
    });
    
    watch(queries, () => fetchGoods(), {deep: true});

    return {
        total,
        goodsData,
        queries,
        fetchGoods
    }
}






