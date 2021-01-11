<template>
    <div class="login-form">
        <a-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            class="form"
            :label-col="labelCol" :wrapper-col="wrapperCol"
        >
            <a-form-item required has-feedback label="邮箱" name="email">
                <a-input
                    size="large"
                    v-model:value="formData.email"
                    autocomplete="off"
                />
            </a-form-item>
            <a-form-item required has-feedback label="密码" name="password">
                <a-input
                    size="large"
                    v-model:value="formData.password"
                    type="password"
                    autocomplete="off"
                />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 9 }">
                <a-button type="primary" html-type="submit" @click="handleLogin"> 确定 </a-button>
                <a-button @click="resetForm" style="margin-left: 20px"> 重置 </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, unref } from "vue";
import { useStore } from 'vuex';
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { UserParams } from "../../../packages/api/types/userTypes"

export default defineComponent({
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        
        const formRef = ref<any>(null);
        const formData: UserParams.AdminLogin = reactive({
            email: "",
            password: "",
        });
        const formRules = reactive({
            email: [{
                required: true,
                trigger: "change",
                message: "请输入用户名。",
            }],
            password: [{
                required: true,
                trigger: "change",
                message: "请输入密码。",
            }]
        });
        async function handleLogin() {
            const form = unref(formRef);
            if(!form) return;
            try {
                const data = await form.validate();
                const result = await store.dispatch("user/adminLogin", {
                    email: data.email,
                    password: data.password
                });

                if(result) {
                    message.success("登录成功");
                    // router.replace({
                    //     path: "/",
                    // })
                    window.location.href = "/"
                }
                
            } catch(error) {
                console.log(error)
            } finally {}
        }

        function resetForm() {
            const form = unref(formRef);
            form.resetFields();
        }

        return {
            formRef,
            formData,
            formRules,
            resetForm,
            handleLogin
        };
    },
    data() {
        return {
            labelCol: { 
                xl: {span: 4, offset: 5},
                lg: {span: 5, offset: 5}, 
                md: {span: 6, offset: 4 }, 
                sm: {span: 24}, 
                xs: {span: 24}
            },
            wrapperCol: { 
                xl: {span: 5 },
                lg: {span: 6 }, 
                md: {span: 7 },  
                sm: {span: 24}, 
                xs: {span: 24} 
            },

        };
    },
    methods: {},
});
</script>

<style scoped lang="less">
.login-form {
    padding: 0 20px;
}

.form {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    // padding-right: 50px;
}
</style>