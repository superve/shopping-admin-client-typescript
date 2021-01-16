<template>
    <div>
        <h4>订单信息</h4>
        <p>订单号码：{{orderItem.out_trade_no}}</p>
        <p>订单状态：
            <a-tag v-if="orderItem.order_type" 
            :color="orderTypes[orderItem.order_type.id - 1].color">
                {{ orderItem.order_type.name }}
            </a-tag>
        </p>
        <p>订单操作：
            <!-- 这里的id和orderTypes创建的数组强关联 -->
            <template v-if="orderItem.order_type">
                <a-button v-for="(item, index) in orderTypes[orderItem.order_type.id - 1].actions"
                :key="index"
                :type="item.btnType"
                size="small"
                style="margin-right: 5px"
                @click="handleAction(item.action, orderItem)">
                    {{item.name}}
                </a-button>
            </template>
        </p>
        <a-divider dashed/>
        <h4>商品列表</h4>
        <a-table 
        :data-source="orderItem.skuses" 
        rowKey="id"
        :pagination="false"
        >
            <a-table-column title="商品">
                <template #default="{record}">
                    <a-avatar 
                    v-if="record.cover"
                    shape="square"
                    :src="request.defaults.baseURL + record.cover.url" />
                    <a-divider type="vertical" />
                    {{record.goods_name}}
                </template>
            </a-table-column>
            <a-table-column title="单价" key="price" data-index="price"/>
            <a-table-column title="SKU">
                <template #default="{record}">
                    {{ record.type_1_name }}: {{ record.type_1 }}
                    <a-divider type="vertical" />
                    {{ record.type_2_name }}: {{ record.type_2 }}
                    <a-divider type="vertical" />
                    {{ record.type_3_name }}: {{ record.type_3 }}
                </template>   
            </a-table-column>
            <a-table-column title="数量">
                <template #default="{record}">
                    {{orderItem.counts_map[record.id]}}
                </template>   
            </a-table-column>
        </a-table>
        <a-divider dashed/>
        <h4>评论列表</h4>
        <a-table 
        :data-source="orderItem.comments" 
        rowKey="id"
        :pagination="false"
        >
            <a-table-column title="详情">
                <template #default="{record}">
                    <p>{{record.content}}</p>
                    <template v-if="record.comment_media">
                        <a-avatar 
                        v-for="(item, index) in record.comment_media" 
                        :key="index"
                        shape="square"
                        :src="request.defaults.baseURL + item.url" />
                        <a-divider type="vertical" />
                    </template>
                </template>
            </a-table-column>
        </a-table>
        <OrderDeliver @deliver="handleDeliver"/>
        <OrderRefund :data="actionCurrent" @refund="handleRefund" >
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as _ from "lodash";
import {AxiosInstance} from "axios";
import useOrder from "./composables/useOrder";
import request from "../../../packages/utils/http/request";
import { useRoute } from "vue-router";
import useOrderTypes from "./composables/useOrderTypes";
import { OrderTypes } from "../../../packages/api/types/orderTypes"
import OrderDeliver from "./components/OrderDeliver.vue";
import OrderRefund from "./components/OrderRefund.vue";

import useMessage from "../../hooks/components/useMessage";
import useConfirm from "../../hooks/components/useConfirm";
import { PayTypes } from "../../../packages/api/types/payTypes"

const { success, error } = useMessage();
const { useWarnConfirm } = useConfirm();

export default defineComponent({
    setup() {
        const route = useRoute();
        const {
            orderItem,
            fetchOrderById,
            handleUpdateOrder,
            handleOrderRefund
        } = useOrder();

        const {
            orderTypes
        } = useOrderTypes();

        onMounted(() => {
            fetchOrderById(route.params.id);
        });

        return {
            orderItem,
            orderTypes,
            fetchOrderById,
            handleUpdateOrder,
            handleOrderRefund
        }
    },
    data(){
        return {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 },
            request,
            actionCurrent: {}
        } as {
            labelCol: Record<string, any>
            wrapperCol: Record<string, any>
            request: AxiosInstance
            actionCurrent: OrderTypes.Order
        }
    },
    components: {
        OrderDeliver,
        OrderRefund
    },
    methods: {
        async handleAction(type: string, item: OrderTypes.Order) {
            this.actionCurrent = item;
            const orderActions: Record<string, Function> = {
                "cancel": async () => {
                    useWarnConfirm("确定取消关闭订单吗?").then(async () => {
                        try {
                            await this.handleUpdateOrder({
                                id: item.id,
                                order_type: 6 // 取消关闭订单
                            });
                            success("操作成功");
                            this.fetchOrderById(this.$route.params.id);
                        } catch (error) {}
                    });
                },
                "deliver": () => {
                    if(OrderDeliver.methods && OrderDeliver.methods.handleVisible) {
                        OrderDeliver.methods.handleVisible(); 
                    }
                },
                "refund": () => {
                    if(OrderRefund.methods && OrderRefund.methods.handleVisible) {
                        OrderRefund.methods.handleVisible(); 
                    }
                }
            }

            if(orderActions[type]) {
                orderActions[type]();
            }
        },
        async handleDeliver(data: OrderTypes.Order) {
            const params = Object.assign({}, this.actionCurrent, data);
            const newParams = _.pick(params, "id", "package_company", "package_number", "order_type");
            await this.handleUpdateOrder(newParams);
            success("操作成功");
            this.fetchOrderById(this.$route.params.id);
        },
        async handleRefund(data: PayTypes.Refund) {
            // 退款
            const result: Record<string, any> = await this.handleOrderRefund(data);
            if( result.msg === "Success" ) {
               // 更新
                await this.handleUpdateOrder({
                    id: this.actionCurrent.id,
                    order_type: 6
                });
                success("操作成功");
                this.fetchOrderById(this.$route.params.id);
            } else {
                error("操作失败: " + result.msg);
            } 
        }
    }
});
</script>

<style>
</style>