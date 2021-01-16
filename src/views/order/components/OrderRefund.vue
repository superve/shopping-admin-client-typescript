<template>
    <div>
        <Dialog title="退款" @yes="handleEditorOk">   
            <a-form 
            :model="formData"
            ref="refundFormRef">
                <a-form-item label="退款金额" 
                placeholder="请填写金额"
                name="refundAmount" 
                :wrapperCol="{ span: 18 }"
                :rules="{
                    required: true,
                    message: '请输入金额'
                }">
                    <a-input v-model:value="formData.refundAmount"></a-input>
                </a-form-item>

                <!-- 做功能保留 -->
                <a-form-item label="退款原因" 
                placeholder="请填写退款原因"
                :wrapperCol="{ span: 18 }"
                :rules="{
                    required: true,
                    message: '请输入退款原因'
                }">
                    <a-input></a-input>
                </a-form-item>
            </a-form>
         </Dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRef, unref, watch } from "vue";
import useModal from "../../../hooks/components/useModal";
import { OrderTypes } from "../../../../packages/api/types/orderTypes"
import { PayTypes } from "../../../../packages/api/types/payTypes"
import { object } from "vue-types";

const ModelDialog = useModal(); // 发货弹窗

export default defineComponent({
    setup(props: {
        data: OrderTypes.Order
    } ) {
        const refundFormRef = ref<any>(null);
        const order = toRef(props, "data");
        const formData = reactive<PayTypes.Refund>({
            outTradeNo: "",
            refundAmount: "",
        })

        watch(order, (newValue) => {
            formData.outTradeNo = String(newValue.out_trade_no) || "",
            formData.refundAmount = String(newValue.all_price) || ""
        }, {
            deep: true
        })

        return {
            refundFormRef,
            formData
        }
    },
    components: {
        Dialog: ModelDialog.Dialog,
    },
    props:{
        data: object().def({})
    },
    methods: {
        handleVisible() {
            ModelDialog.triggerVisible();
        },
        async handleEditorOk() {
            const form = unref(this.refundFormRef);
            if(!form) return;

            try {
                const data = await form.validate();
                await this.$emit('refund', this.formData);
                ModelDialog.triggerVisible();
            }catch(err) {}  
        },
    }
});
</script>

<style>
</style>