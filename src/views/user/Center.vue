<template>
    <div>
        <PropertiesFilter :filterKeys="filterKeys" @search="handleSearch"/>
        <a-table :data-source="usersData">
            <a-table-column key="id" title="Id" data-index="id"/>
            <a-table-column key="username" title="用户名" data-index="username"/>
        </a-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from 'vuex'
import PropertiesFilter from "../../components/filter/PropertiesFilter.vue"

export default defineComponent({
    setup() { 
        const store = useStore();
        let usersData = ref([]);
        let start = ref(0);
        let limit = ref(2);
        
        // 获取所有用户
        const fetchAllUsers = async (query?: object) => {
            const result = await store.dispatch("user/getAllUsers", {
                _start: start.value,
                _limit: limit.value,
                ...query
            });
            usersData.value = result.map((v: any) => {
                v.key = v.id;
                return v;
            });
        }
        onMounted(fetchAllUsers);
        return {
            start,
            limit,
            usersData,
            fetchAllUsers
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
            const queryContains: Record<string, any> = {};
            Object.keys(query).forEach((v: string)=> {
                queryContains[v + "_contains"] = query[v];
            });
            this.fetchAllUsers(queryContains);
        }
    }
});
</script>

<style>
</style>