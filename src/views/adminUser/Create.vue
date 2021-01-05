<template>
    <div>
        <a-form :model="formData" 
        :rules="rules" 
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
        ref="formRef">
            <a-form-item label="姓氏" name="firstname">
                <a-input v-model:value="formData.firstname"></a-input>
            </a-form-item>
            <a-form-item label="名字" name="lastname">
                <a-input v-model:value="formData.lastname"></a-input>
            </a-form-item>
            <a-form-item label="邮箱" name="email">
                <a-input v-model:value="formData.email"></a-input>
            </a-form-item>
            <a-form-item label="角色"  name="roles">
                <a-select v-model:value="formData.roles" 
                style="width: 100%"
                placeholder="请选择角色"
                mode="multiple">
                    <a-select-option 
                    v-for="(item, index) in roleData" 
                    :key="index"
                    :value="item.id">
                        {{item.name}}
                    </a-select-option>
            </a-select>
            </a-form-item>
            <a-form-item :wrapper-col="{ 
                span: wrapperCol.span, 
                offset: labelCol.span 
            }">
                <a-button type="primary" @click="onSubmit">
                    确定
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, unref } from "vue";
import { useStore } from 'vuex'
import { UserParams } from "../../../packages/api/types/userTypes";
import { message } from "ant-design-vue";

export default defineComponent({
    setup() {
        const store = useStore();
        let roleData = ref([]);
        const formRef = ref<any>(null);

        // 获取所有角色
        const fetchRoles = async () => {
            const result = await store.dispatch("role/getAdminRoles");
            roleData.value = result;
        }
        
        function resetForm() {
            const form = unref(formRef);
            form.resetFields();
        }

        onMounted(fetchRoles);
        return {
            formRef, // 必须要返回
            store,
            roleData,
            fetchRoles,
            resetForm
        }
    },
    data(){
        return {
            labelCol: { span: 2 },
            wrapperCol: { span: 10 },
            formData: {
                firstname: "",
                lastname: "",
                email: "",
                roles: []
            },
            rules: {
                firstname: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请输入姓氏。",
                    }
                ],
                lastname: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请输入名字。",
                    }
                ],
                email: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请输入邮箱。",
                    }
                ],
                roles: [ // 需要自定义错误
                    {
                        required: true,
                        message: "请选择角色。",
                    }
                ]
            }
        } as {
            formData: UserParams.CreateAdmin
        }
    },
    methods: {
        async onSubmit() {
            const form = unref(this.formRef);
            if(!form) return;

            try {
                const data = await form.validate();
                await this.store.dispatch("user/createAdmin", data);
                message.success("新增管理员成功");
                // 重置表单
                // this.resetForm();
                this.formData = {
                    firstname: "",
                    lastname: "",
                    email: "",
                    roles: []
                }
                
            } catch(error) {
                console.log(error)
            } finally {}
        }
    }
});
</script>

<style>
</style>