<template>
    <div>
        <a-form 
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
        :model="formData" 
        :rules="rules" 
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
            <a-form-item label="用户名" name="username">
                <a-input v-model:value="formData.username" placeholder="请输入用户名"></a-input>
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
            <a-form-item label="状态">
                <a-switch :checked="formData.isActive" @change="onActiveChange" />
            </a-form-item>
            <a-form-item :wrapper-col="{ 
                span: wrapperCol.span, 
                offset: labelCol.span 
            }">
                <a-button type="primary" @click="handleEditeUser">
                    确定
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from 'vuex'
import { UserParams } from "../../../packages/api/types/userTypes"

const validRoles = (rule: any, value: Array<number>, callback: () => {}) => {
    if(value.length > 0) {
        return Promise.resolve();
    } else {
        return Promise.reject('请选择角色');
    }
    callback();
}

export default defineComponent({
    setup() {
        const store = useStore();
        const route = useRoute();
        const roleData = ref([]);
        const userData = ref({});
        const formData: Partial<UserParams.CreateAdmin> = reactive({
            firstname: "",
            lastname: "",
            email: "",
            roles: [],
            isActive: true,
            username: ""
        });
        const rules = reactive({
            firstname: [{ required: true, trigger: "change", message: "请输入姓氏。"}],
            lastname: [{ required: true, trigger: "change", message: "请输入名字。"}],
            email: [{ required: true, trigger: "change", message: "请输入邮箱。"}],
            roles: [{ required: true, validator: validRoles}],
        });
        const formRef = ref<any>(null);

        // 获取所有角色
        const fetchRoles = async () => {
            const result = await store.dispatch("role/getAdminRoles");
            roleData.value = result;
        }
        
        // 获取当前用户数据
        const fetchUser = async () => {
            const result = await store.dispatch("user/getAdminById", {
                url: "/admin/users/" + route.params.id,
            });
            const { data } = result;
            userData.value = data;

            formData.firstname = data.firstname;
            formData.lastname = data.lastname;
            formData.email = data.email;
            formData.roles = data.roles.map((v: any) => v.id);
            formData.isActive = data.isActive;
            formData.username = data.username;
        }
        onMounted(fetchRoles);
        onMounted(fetchUser);

        // 提交编辑数据的方法
        const handleEditeUser = async () => {
            const form = unref(formRef);
            if(!form) return;
            try {
                const data = await form.validate();
                const result = await store.dispatch("user/editeAdmin", {
                    data: formData,
                    url: "/admin/users/" + route.params.id,
                });
                if(result) {
                    console.log(result)
                }
            } catch (error) {
                console.log(error)
            }
        }

        return {
            formRef,
            formData,
            rules,
            roleData,
            userData,
            handleEditeUser
        }
    },
    data(){
        return {
            labelCol: { span: 2 },
            wrapperCol: { span: 10 },
        }
    },
    methods: {
        onActiveChange(value: boolean) {
            this.formData.isActive = value;
        }
    }
});
</script>

<style>
</style>