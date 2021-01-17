<template>
    <div>
        <PropertiesFilter :filterKeys="filterKeys" @search="handleOrderFilter"/>
        <a-table 
        :data-source="ordersData" 
        @change="handleChange"
        rowKey="id"
        :pagination="{
            total: total,
            pageSize: queries._limit,
        }">
            <a-table-column key="id" title="Id">
                <template #default="{record}">
                    <router-link :to="`/order/update/${record.id}`">
                        {{record.id}}
                    </router-link>
                </template>
            </a-table-column>
            <a-table-column key="user" title="用户">
                <template #default="{record}">
                    <a-list item-layout="horizontal" :data-source="record.skuses">
                        <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta>
                            <template #description>
                                {{ item.type_1_name }}: {{ item.type_1 }}
                                <a-divider type="vertical" />
                                {{ item.type_2_name }}: {{ item.type_2 }}
                                <a-divider type="vertical" />
                                {{ item.type_3_name }}: {{ item.type_3 }}
                                <a-divider type="vertical" />
                                数量：{{record.counts_map[item.id]}}
                            </template>
                            <template #title>
                                <router-link :to="`/goods/update/${item.goods}`">
                                    {{ item.goods_name }}
                                </router-link>
                            </template>
                            <template #avatar v-if="item.cover">
                                <a-avatar 
                                shape="square"
                                :src="request.defaults.baseURL + item.cover.url" />
                            </template>
                            </a-list-item-meta>
                        </a-list-item>
                        </template>
                    </a-list>
                </template>
            </a-table-column>
            <a-table-column key="out_trade_no" title="订单号" data-index="out_trade_no"/>
            <a-table-column key="user" title="用户">
                <template #default="{record}">
                    <router-link :to="`/user/update/` + record.user.id">
                        {{record.user.username}}
                    </router-link>
                </template>
            </a-table-column>
            <a-table-column key="is_sale" title="状态">
                <template #default="{record}">
                    <!-- 这里的id和orderTypes创建的数组强关联 -->
                    <a-tag :color="orderTypes[record.order_type.id - 1].color">
                        {{ record.order_type.name }}
                    </a-tag>
                </template>
            </a-table-column>
            <a-table-column key="actions" title="操作">
                <template #default="{record}">
                    <!-- 这里的id和orderTypes创建的数组强关联 -->
                    <a-button v-for="(item, index) in orderTypes[record.order_type.id - 1].actions"
                    :key="index"
                    :type="item.btnType"
                    size="small"
                    style="margin-right: 5px"
                    @click="handleAction(item.action, record)">
                        {{item.name}}
                    </a-button>
                </template>    
            </a-table-column>  
        </a-table>
        <OrderDeliver @deliver="handleDeliver"/>
        <OrderRefund :data="actionCurrent" @refund="handleRefund" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as _ from "lodash";
import { AxiosInstance } from "axios";

import useOrder from "./composables/useOrder";
import useOrderFilter from "./composables/useOrderFilter";
import useOrderTypes from "./composables/useOrderTypes";
import OrderDeliver from "./components/OrderDeliver.vue";
import OrderRefund from "./components/OrderRefund.vue";

import PropertiesFilter from "../../components/propertiesFilter/index.vue"
import useMessage from "../../hooks/components/useMessage";
import useConfirm from "../../hooks/components/useConfirm";

import { OrderTypes } from "../../../packages/api/types/orderTypes"
import { PayTypes } from "../../../packages/api/types/payTypes"
import request from "../../../packages/utils/http/request";

const { success, error } = useMessage();
const { useWarnConfirm } = useConfirm();

export default defineComponent({
    setup() {
        const {
            ordersData,
            total,
            queries,
            fetchOrders,
            fetchOrdersCount,
            handleUpdateOrder,
            handleOrderRefund
        } = useOrder();
        const {filterKeys, handleOrderFilter} = useOrderFilter(queries);

        const {
            orderTypes
        } = useOrderTypes();
        
        onMounted(() => {
            fetchOrders();
            fetchOrdersCount();
        });

        return {
            ordersData,
            queries,
            total,
            fetchOrders,
            fetchOrdersCount,
            handleUpdateOrder,
            handleOrderRefund,

            filterKeys,
            handleOrderFilter,

            orderTypes
        }
    },
    data() {
        return {
            request,
            actionCurrent: {}
        } as {
            request: AxiosInstance
            actionCurrent: OrderTypes.Order
        }
    },
    components: {
        PropertiesFilter,
        OrderDeliver,
        OrderRefund
    },
    methods: {
        handleChange(value: Record<string, number>){
            this.queries._start = value.current * value.pageSize - value.pageSize;
        },
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
                            this.fetchOrders();
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
            this.fetchOrders();
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
                this.fetchOrders();
            } else {
                error("操作失败: " + result.msg);
            } 
        }
    }
});
</script>

<style>
</style>