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
            <a-table-column key="id" title="Id" data-index="id"/>
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
                    <a-tag :color="record.status ? 'green' : 'orange'">
                        收货状态
                    </a-tag>
                </template>
            </a-table-column>
            <a-table-column key="actions" title="操作">
                <template #default="{record}">
                    <router-link :to="`/order/update/${record.id}`">编辑</router-link>
                </template>    
            </a-table-column>  
        </a-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import useOrder from "./composables/useOrder";
import useOrderFilter from "./composables/useOrderFilter";
import PropertiesFilter from "../../components/propertiesFilter/index.vue"

export default defineComponent({
    setup() {
        const {
            ordersData,
            total,
            queries,
            fetchOrders,
            fetchOrdersCount
        } = useOrder();
        const {filterKeys, handleOrderFilter} = useOrderFilter(queries);
        
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

            filterKeys,
            handleOrderFilter
        }
    },
    components: {
        PropertiesFilter
    },
    methods: {
        handleChange(value: Record<string, number>){
            this.queries._start = value.current * value.pageSize - value.pageSize;
        },
    }
});
</script>

<style>
</style>