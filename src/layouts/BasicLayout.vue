<template>
    <a-layout class="container">
        <a-layout-sider breakpoint="lg" collapsed-width="0">
            <div class="logo" />
            {{menusRoutes.children}}
            <a-menu
                theme="dark"
                mode="inline"
                v-model:selectedKeys="selectedKeys"
            > 
                <template 
                v-for="(item, index) in menusRoutes[0].children" 
                :key="index">
                    <template v-if="!item.children">
                        <a-menu-item :key="`${index}`">
                            <router-link :to="item.path">{{item.meta.label}}</router-link>
                        </a-menu-item>
                    </template>
                    <template v-else>
                        <a-sub-menu 
                            :key="`${index}`"
                            :title="item.meta.label">
                                <a-menu-item 
                                v-for="(subItem, subIndex) in item.children" 
                                :key="`${index}-${subIndex}`">
                                    <router-link 
                                    :to="`${item.path}/${subItem.path}`">
                                        {{subItem.meta.label}}
                                    </router-link>
                                </a-menu-item>
                            </a-sub-menu>
                    </template>    
                </template>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header />
            <a-layout-content class="layout-content">
                <router-view></router-view>
            </a-layout-content>
            <a-layout-footer style="textalign: center">
                ©2020 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { menusRoutes } from "../router/router.config";
import { generatorRoutes } from "../router/createRoutes"

export default defineComponent({
    data() {
        return {
            selectedKeys: ["0"],
            menusRoutes: generatorRoutes(menusRoutes)
        };
    },
    components: {},
    methods: {},
});
</script>

<style scoped lang="less">
.container {
    height: 100vh;

    .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
    }

    .layout-content {
        margin: 24px 16px 0;
        padding: 24px;
        background: #fff;
    }
}
</style>