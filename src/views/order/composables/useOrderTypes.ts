import { onMounted, ref } from "vue";
import orderApi from "../../../../packages/api/order";

// 状态映射功能
type OrderTypeMap = Array<{
    color: string
    type_name: String
    actions: Array<{
        name: string
        action: string
        btnType: string
    }>

}>
const orderTypeMap: OrderTypeMap = [
    {
        color: "orange",
        type_name: "未付款",
        actions: [
            { name: "取消", action: "cancel", btnType: "default"}
        ]
    },
    {
        color: "orange",
        type_name: "待发货",
        actions: [
            { name: "发货", action: "deliver", btnType: "primary"},
            { name: "取消", action: "cancel", btnType: "default"}
        ]
    },
    {
        color: "green",
        type_name: "已发货",
        actions: [
            { name: "取消", action: "cancel", btnType: "default" }
        ]
    },
    {
        color: "green",
        type_name: "退货退款",
        actions: [
            { name: "退款", action: "refund", btnType: "danger"}
        ]
    },
    {
        color: "green",
        type_name: "已完成",
        actions: []
    },
    {
        color: "gray",
        type_name: "已取消",
        actions: []
    },
];


export default function useOrderTypes() {
    const orderTypes = ref<any>([]);
    async function fetchOrderTypes() {
        const result = await orderApi.getOrderTypes();
        if(result && Array.isArray(result)) {
            const newResult = result.map((v, i) => {
                return {
                    ...v,
                    ...orderTypeMap[i]
                }
            });
            orderTypes.value = newResult;
        }
    }

    onMounted(fetchOrderTypes);
    return {
        orderTypes,
        fetchOrderTypes
    }

}