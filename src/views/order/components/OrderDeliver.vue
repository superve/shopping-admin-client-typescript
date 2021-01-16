<template>
    <div>
        <Dialog title="订单发货" @yes="handleEditorOk">   
            <a-form 
            :model="formData"
            ref="deliverFormRef">
                <a-form-item label="物流单号" 
                placeholder="请选择物流单号"
                name="package_company" 
                :wrapperCol="{ span: 18 }"
                :rules="{
                    required: true,
                    message: '请选择物流公司'
                }">
                    <a-select v-model:value="formData.package_company">
                        <a-select-option value="顺丰">
                            顺丰
                        </a-select-option>
                        <a-select-option value="EMS">
                            EMS
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="快递单号" 
                placeholder="请填写快递单号"
                name="package_number" 
                :wrapperCol="{ span: 18 }"
                :rules="{
                    required: true,
                    message: '请输入栏目名字'
                }">
                    <a-input v-model:value="formData.package_number"></a-input>
                </a-form-item>
            </a-form>
         </Dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import useModal from "../../../hooks/components/useModal";

const ModelDialog = useModal(); // 发货弹窗

export default defineComponent({
    setup(props) {
        const deliverFormRef = ref<any>(null);

        return {
            deliverFormRef
        }
    },
    data(){
        return {
            formData: {
                package_number: "",
                package_company: "EMS",
                // 发货需要修改状态为已发货
                order_type: 3
            }
        }
    },
    components: {
        Dialog: ModelDialog.Dialog,
    },
    methods: {
        handleVisible() {
            ModelDialog.triggerVisible();
        },
        async handleEditorOk() {
            const form = unref(this.deliverFormRef);
            if(!form) return;

            try {
                const data = await form.validate();
                await this.$emit('deliver', this.formData);
                ModelDialog.triggerVisible();
            }catch(err) {}  
        },
    }
});
</script>

<style>
</style>