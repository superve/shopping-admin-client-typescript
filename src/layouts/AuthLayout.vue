<template>
    <div class="main-container">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
});
</script>

<style scoped lang="less">
    .main-container{
        background: #f5f5f5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100vh;
    }
    
    h2 {
        text-align: center;
    }
</style>