<template>
    <div class="breadcrumd">
        <a-breadcrumb>
            <template 
            v-for="(item, index) in routeData"
            :key="index">
                <a-breadcrumb-item
                 v-if="item.meta.label"
                >
                    <router-link :to="item.path">{{item.meta.label}}</router-link>
                </a-breadcrumb-item>
            </template>
        </a-breadcrumb>
        <a-divider />
    </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from "vue";
import { useRouter, useRoute } from 'vue-router';

type dataType = {
    routeData: Array<{}>
}

export default defineComponent({
    // setup() {
    //     const route = useRoute();
    //     let routeData = ref<Array<{}>>([]);
           // 莫名奇妙的警告 
    //     routeData.value = route.matched
    //     watch(route, newRoute => {
    //         routeData.value = newRoute.matched
    //     }, { immediate: true })

    //     return {
    //         routeData
    //     };
    // },
    data() {
        return {
            routeData: []
        } as dataType
    },
    created() {
        this.$watch(
            () => this.$route,
            (newRoute: any) => {
                this.routeData = newRoute.matched
            },
            { immediate: true }
        )
    },
})
</script>

<style>

</style>