<template>
    <div>
        <PropertiesFilter :filterKeys="filterKeys" @search="handleSearch"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from 'vuex'
import PropertiesFilter from "../../components/filter/PropertiesFilter.vue"

export default defineComponent({
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
        handleSearch() {

        }
    }
});
</script>

<style>
</style>