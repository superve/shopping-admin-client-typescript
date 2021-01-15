import {ref, Ref, unref} from "vue";
import { OrderTypes } from "../../../../packages/api/types/orderTypes";

export default function useOrderFilter(queries: Ref<OrderTypes.GetOrders>) {
    const filterKeys = ref([
        { key: "", label: "请选择" },
        { key: "id", label: "id" },
        { key: "out_trade_no", label: "订单编号" },
        { key: "package_company", label: "快递公司" },
        { key: "package_number", label: "快递号码" },
    ]);
    
    function handleOrderFilter(query: Record<string, any>) {
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
        handleOrderFilter
    }
}