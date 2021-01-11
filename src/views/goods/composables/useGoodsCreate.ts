import {reactive, ref, toRef, unref, } from "vue";
import { GoodsTypes } from "../../../../packages/api/types/goodsTypes";
import goodsApi from "../../../../packages/api/goods";

export default function useGoodsCreate() {
    const formData: GoodsTypes.CreateGoods = reactive({
        goods_name: "",
        purchasing_price: 0,
        sales_price: 0,
        inventory: 0, // 总库存
        sales_inventory: 0, // 可销售数量
        goods_media: [],
        description: "",
        is_sale: true,
        saled_at: new Date(),
        skus: []
    })
    const goods_media = toRef(formData, "goods_media");
    const skus = toRef(formData, "skus");
    const formRef = ref<any>(null);

    const rules = ref({
        goods_name: [{ required: true, trigger: "change", message: "请输入商品名。"}],
        purchasing_price: [{ required: true, trigger: "change", message: "请输入采购价。"}],
        sales_price: [{ required: true, trigger: "change", message: "请输入销售价。"}],
        inventory: [{ required: true, trigger: "change", message: "请输入总库存。"}],
        sales_inventory: [{ required: true, trigger: "change", message: "请输可销售数量。"}],
    })

    async function handleGoodsCreate(){
        const queries = unref(formData);
        const form = unref(formRef);

        try {
            await form.validate();
            const result = await goodsApi.createGoods(queries);
            if(result) {
                console.log(result)
            }
        } catch (error) {}
    }

    return {
        formData,
        goods_media,
        skus,
        rules,
        formRef,
        handleGoodsCreate
    }
}