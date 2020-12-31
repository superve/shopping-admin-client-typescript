<template>
    <div class="main-container">
        <BreadCrumd/>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BreadCrumd from "./components/BreadCrumd.vue";

export default defineComponent({
    components: {
        BreadCrumd
    }
});
</script>

<style>
</style>