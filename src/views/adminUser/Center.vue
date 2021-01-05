<template>
    <div>
        <PropertiesFilter :filterKeys="filterKeys" @search="handleSearch"/>
        <a-table 
        :data-source="adminData" 
        @change="handleChange"
        :pagination="{
            total: total,
            pageSize: queries.pageSize,
        }">
            <a-table-column key="id" title="Id" data-index="id"/>
            <a-table-column key="email" title="邮箱" data-index="email"/>
            <a-table-column key="username" title="用户名">
                <template #default="{record}">
                    {{record.firstname + record.lastname}}
                </template>
            </a-table-column>
            <a-table-column key="roles" title="角色">
                <template #default="{record}">
                    <div>
                        <span 
                        v-for="(item, index) in record.roles" 
                        :key="index"
                        style="margin:0 10px">
                            {{item.name}}
                        </span>
                    </div>
                </template>
            </a-table-column>
        </a-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted} from "vue";
import { useStore } from 'vuex'
import PropertiesFilter from "../../components/filter/PropertiesFilter.vue"
import { UserParams } from "../../../packages/api/types/userTypes"

export default defineComponent({
    setup() {
        const store = useStore();
        let adminData = ref([]);
        let total = ref(0);
        let queries = ref<UserParams.GetAdmin>({
            page: 1,
            pageSize: 5
        });

        // const setQueries = function(query?: object){
        //     queries.value = {
        //         page: page.value,
        //         pageSize: pageSize.value,
        //         ...query
        //     }
        // }
        
        // 获取所有用户
        const fetchAllAdmin = async () => {
            const result = await store.dispatch("user/getAdmin", queries.value);
            const {results, pagination} = result.data;
            total.value = pagination.total;

            adminData.value = results.map((v: any) => {
                v.key = v.id;
                return v;
            });
        }
        onMounted(fetchAllAdmin);
        return {
            adminData,
            // setQueries,
            fetchAllAdmin,
            total,
            queries
        }
    },
    data: () => ({
        filterKeys: [
            { key: "", label: "请选择" },
            { key: "id", label: "id" },
            { key: "firstname", label: "姓" },
            { key: "lastname", label: "名字" },
            { key: "email", label: "邮箱" }
        ]
    }),
    components: {
        PropertiesFilter
    },
    methods: {
        handleSearch(query: Record<string, any>) {
            // 清理之前的条件
            const queries = {
                page: 1,
                pageSize: this.queries.pageSize
            };
            const queryContains: Record<string, any> = {};
            Object.keys(query).forEach((v: string)=> {
                queryContains[v + "_contains"] = query[v];
            });
            // this.setQueries(queryContains);
            this.queries = {
                ...queries,
                ...queryContains
            }  
            this.fetchAllAdmin();
        },
        handleChange(value: Record<string, number>){
            this.queries.page = value.current;
            this.fetchAllAdmin();
        },
    }
});
</script>

<style>
</style>