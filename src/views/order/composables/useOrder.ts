import { ref, watch, unref } from "vue";
import orderApi from "../../../../packages/api/order"
import payApi from "../../../../packages/api/pay"
import { OrderTypes } from "../../../../packages/api/types/orderTypes"
import { PayTypes } from "../../../../packages/api/types/payTypes"

export default function useOrder() {
    const ordersData = ref<any>([]);
    const total = ref<number>(0);
    const queries = ref<OrderTypes.GetOrders>({
        _start: 0,
        _limit: 5
    });
    const orderItem = ref<OrderTypes.Order | any>({})

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

    async function fetchOrderById(id: string | string[]) {
        const result = await orderApi.getOrderById({}, {
            url: "/orders/" + id
        })
        orderItem.value = result;
    }

    // 这里和编辑商品不同，这可以在列表中编辑中，不是详情页表单中编辑formData
    async function handleUpdateOrder(data: OrderTypes.Order) {
        const result = await orderApi.updateOrder(data, {
            url: "/orders/" + data.id
        });
        return result;
    }

    // 退款, 退款后订单为取消状态 = 6
    async function handleOrderRefund(data: PayTypes.Refund) {
        const result = await payApi.payAlipayRefund(data);
        return result;
    }

    watch(queries, () => fetchOrders(), {deep: true});

    return {
        ordersData,
        queries,
        total,
        fetchOrders,
        fetchOrdersCount,
        orderItem,
        fetchOrderById,
        handleUpdateOrder,
        handleOrderRefund
    }
}