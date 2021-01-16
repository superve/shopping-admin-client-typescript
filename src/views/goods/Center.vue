<template>
    <div>
        <PropertiesFilter :filterKeys="filterKeys" @search="handleGoodsFilter"/>
        <a-table 
        :data-source="goodsData" 
        @change="handleChange"
        rowKey="id"
        :pagination="{
            total: total,
            pageSize: queries._limit,
        }">
            <a-table-column key="id" title="Id" data-index="id"/>
            <a-table-column key="goods_name" title="商品名称" >
                <template #default="{record}">
                    <a-avatar 
                    v-if="record.goods_media[0]"
                    shape="square"
                    :src="request.defaults.baseURL + record.goods_media[0].url" />
                    <a-divider type="vertical" />
                    {{record.goods_name}}
                </template>
            </a-table-column>
            <a-table-column key="inventory" title="库存">
                <template #default="{record}">
                    {{record.goods_number || 0}}
                </template>
            </a-table-column>
            <a-table-column key="is_sale" title="在售">
                <template #default="{record}">
                    <a-tag :color="record.is_sale ? 'green' : 'orange'">
                        {{record.is_sale ? "启用" : "关闭"}}
                    </a-tag>
                </template>
            </a-table-column>
            <a-table-column key="actions" title="操作">
                <template #default="{record}">
                    <router-link :to="`/goods/update/${record.id}`">编辑</router-link>
                    <a-divider type="vertical" />
                </template>    
            </a-table-column>  
        </a-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import useGoods from "./composables/useGoods";
import useGoodsFilter from "./composables/useGoodsFilter";
import PropertiesFilter from "../../components/propertiesFilter/index.vue";
import request from "../../../packages/utils/http/request";

export default defineComponent({
    setup() {
        const {queries, goodsData, total, fetchGoods, fetchGoodsCount} = useGoods();
        const {filterKeys, handleGoodsFilter} = useGoodsFilter(queries);

        onMounted(() => {
            fetchGoods();
            fetchGoodsCount();
        });
        
        return {
            queries,
            goodsData,
            total,
            filterKeys,
            handleGoodsFilter
        }
    },
    data() {
        return {
            request
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