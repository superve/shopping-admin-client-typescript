<template>
    <div>
        <PropertiesFilter :filterKeys="filterKeys" @search="handleSearch"/>
        <a-table 
        :data-source="usersData"
        @change="handleChange"
        :pagination="{
            total: total,
            pageSize: queries._limit,
        }">
            <a-table-column key="id" title="Id" data-index="id"/>
            <a-table-column key="username" title="用户名" data-index="username"/>
        </a-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from 'vuex'
import PropertiesFilter from "../../components/propertiesFilter/index.vue"
import { UserParams } from "../../../packages/api/types/userTypes"

export default defineComponent({
    setup() { 
        const store = useStore();
        let usersData = ref([]);
        // let start = ref(0);
        // let limit = ref(2);
        let total = ref(0);
        let queries = ref<UserParams.GetUsers>({
            _start: 0,
            _limit: 2
        });

        // 获取用户总数
        const fetchUsersCount = async () => {
            const {_start, _limit, ...props} = queries.value;
            const result = await store.dispatch("user/getUsersCount", props);
            total.value = result;
        }

        // 获取所有用户
        const fetchAllUsers = async () => {
            const result = await store.dispatch("user/getUsers", queries.value);
            usersData.value = result.map((v: any) => {
                v.key = v.id;
                return v;
            });
            
            fetchUsersCount();
        }     
        onMounted(fetchAllUsers);
        return {
            queries,
            total,
            usersData,
            fetchAllUsers,
        }
    },
    data: () => ({
        filterKeys: [
            { key: "", label: "请选择" },
            { key: "id", label: "id" },
            { key: "username", label: "用户名" },
            { key: "email", label: "邮箱" }
        ]
    }),
    components: {
        PropertiesFilter
    },
    computed: {
        rowSelection() {
            return {
                onChange() {},
            }
        }
    },
    methods: {
        handleSearch(query: Record<string, any>) {
            // 清理之前的条件
            const queries = {
                _start: 0,
                _limit: this.queries._limit
            };
            const queryContains: Record<string, any> = {};
            Object.keys(query).forEach((v: string)=> {
                queryContains[v + "_contains"] = query[v];
            });
            this.queries = {
                ...queries,
                ...queryContains
            }
            this.fetchAllUsers();
        },
        handleChange(value: Record<string, number>){
            this.queries._start = value.current * value.pageSize - value.pageSize;
            this.fetchAllUsers();
        },
    }
});
</script>

<style>
</style>