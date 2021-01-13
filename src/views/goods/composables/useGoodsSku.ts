import goodsApi from "../../../../packages/api/goods";
import useMessage from "../../../hooks/components/useMessage";
import { GoodsTypes } from "../../../../packages/api/types/goodsTypes"

const { success } = useMessage();
export type Skus = Array<GoodsTypes.GoodsSku>;

export default function useGoodsSku() {
    function updateStart(skus: Skus) {
        return skus.map(async sku => {
            return await goodsApi.updateGoodsSku(sku, {
                url: "/skus/" + sku.id
            })
        })
    }

    function createStart(skus: Skus) {
        return skus.map(async sku => {
            return await goodsApi.createGoodsSku(sku)
        })
    }

    function updateGoodsSku(skus: Skus) {
        return Promise.all(updateStart(skus));
    }

    function createGoodsSku(skus: Skus) {
        return Promise.all(createStart(skus));
    }

    async function composeGoodsSku(edtitSkus: Skus, createSkus: Skus){
        try {
            await updateGoodsSku(edtitSkus);
            await createGoodsSku(createSkus);
            success("修改成功!");
        } catch (error) {    }
    }

    return {
        updateGoodsSku,
        createGoodsSku,
        composeGoodsSku
    }

}