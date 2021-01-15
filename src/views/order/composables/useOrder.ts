import { ref, watch, unref } from "vue";
import orderApi from "../../../../packages/api/order"
import { GoodsTypes } from "../../../../packages/api/types/goodsTypes"

export default function useOrder() {
    const ordersData = ref<any>([]);
    const total = ref<number>(0);
    const queries = ref<GoodsTypes.GetGoods>({
        _start: 0,
        _limit: 5
    });

    async function fetchOrders() {
        const _queries = unref(queries);
        const result = await orderApi.getOrders(_queries);
        ordersData.value = result;
    }

    async function fetchOrdersCount() {
        const {_start, _limit, ..._queries} = unref(queries);
        const result = await orderApi.getOrdersCount(_queries);
        if(typeof result === "number") {
            total.value = result;
        }
    }

    watch(queries, () => fetchOrders(), {deep: true});

    return {
        ordersData,
        queries,
        total,
        fetchOrders,
        fetchOrdersCount
    }
}