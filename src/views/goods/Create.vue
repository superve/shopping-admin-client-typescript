<template>
    <div>
        <a-form
            :model="formData"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            ref="formRef"
        >
            <a-form-item label="商品名称" name="goods_name">
                <a-input v-model:value="formData.goods_name"></a-input>
            </a-form-item>
            <a-form-item label="图片" name="goods_media">
                <a-upload
                    :action="request.defaults.baseURL + '/upload'"
                    :headers="{
                        Authorization: token
                    }"
                    method="POST"
                    name="files"
                    list-type="picture-card"
                    :file-list="fileList"
                    @preview="handlePreview"
                    @change="handleChange"
                    >
                    <div v-if="goods_media.length < 5">
                        <div class="ant-upload-text">本地图片</div>
                    </div>
                </a-upload>
            </a-form-item>
            <a-form-item label="采购价" name="purchasing_price">
                <a-input v-model:value="formData.purchasing_price"></a-input>
            </a-form-item>
            <a-form-item label="销售价" name="sales_price">
                <a-input v-model:value="formData.sales_price"></a-input>
            </a-form-item>
            <a-form-item label="总库存" name="inventory">
                <a-input v-model:value="formData.inventory"></a-input>
            </a-form-item>
            <a-form-item label="销售库存" name="sales_inventory">
                <a-input v-model:value="formData.sales_inventory"></a-input>
            </a-form-item>
            <a-form-item label="SKU名" :wrapper-col="{ span: 14}">
                <a-row :gutter="[16]">
                    <a-col v-for="(item, index) in skuName"
                    :key="index">
                        <a-input v-model:value="item.value" :placeholder="item.placeholder">
                        </a-input>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item label="SKU值" :wrapper-col="{ span: 20}">
                <a-row :gutter="[16]" v-for="(item, index) in skuValue"
                    :key="index">
                    <a-col v-for="(subItem, key, subIndex) in item"
                    :key="subIndex">
                        <a-input v-model:value="item[key]" 
                        :placeholder="skuName[subIndex] && skuName[subIndex].value || skuPlaceholder[key]">
                        </a-input>
                    </a-col>
                    <a-col v-if="index > 0">
                        <a-button @click="removeSku(index)">删除</a-button>
                    </a-col>
                </a-row>
                <a-button size="small" @click="addSku">新增</a-button>
            </a-form-item>
            <a-form-item label="状态" name="is_sale">
                <a-switch :checked="formData.is_sale" @change="onIsSale" />
            </a-form-item>
            <a-form-item label="详情"  :wrapper-col="{ span: 20}">
                <RichEditor v-model:value="formData.description" @uploadImage="handleUploadImage"/>
            </a-form-item>
            <a-form-item
                :wrapper-col="{
                    span: wrapperCol.span,
                    offset: labelCol.span,
                }"
            >
                <a-button type="primary" @click="handleSubmit">确定</a-button>
            </a-form-item>
        </a-form>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useGoodsCreate from "./composables/useGoodsCreate";
import useUpload from "./composables/useUpload";
import getBase64 from "../../../packages/utils/getBase64";
import request from "../../../packages/utils/http/request";
import { getToken } from "../../../packages/utils/storage";

import RichEditor from "../../components/richEditor/Index";
import { Editor } from "../../components/richEditor/types";

const skuItem = {
    type_1: "",
    type_2: "",
    type_3: "",
    // type_1_name: "",
    // type_2_name: "",
    // type_3_name: "",
    price: "",
    inventory: "",
    sales_volume: ""
}

export default defineComponent({
    setup() {
        const { 
            formData, 
            goods_media, 
            skus, 
            rules, 
            handleGoodsCreate,
            formRef
        } = useGoodsCreate();
        return {
            formData,
            goods_media,
            skus,
            rules,
            handleGoodsCreate,
            formRef,
            token: getToken(),
        }
    },
    data() {
        return {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 },
            fileList: [],
            request,
            previewVisible: false,
            previewImage: '',
            skuName: [
                { value: "", placeholder: "类型一(颜色)" },
                { value: "", placeholder: "类型二(尺寸)" },
                { value: "", placeholder: "类型三(套餐)" }
            ],
            skuValue: [skuItem],
            skuItem,
            skuPlaceholder: {
                type_1: "类型一",
                type_2: "类型二",
                type_3: "类型三",
                price: "单价",
                inventory: "库存",
                sales_volume: "销量"
            },
            description: "什么东西，不能编辑都有"
        }
    },
    components: {
        RichEditor
    },
    methods: {
        onIsSale(value: boolean) {
            this.formData.is_sale = value;
        },
        handleCancel() {
            this.previewVisible = false;
        },
        async handlePreview(file: any) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
        },
        handleChange({file, fileList }: any) {
            this.fileList = fileList;
            
            if(file.status === "done") {
                // 单张上传返回的response的永远只有一张
                this.goods_media = fileList.map((v:any) => v.response[0]);
            }         
        },
        addSku() {
            this.skuValue.push({...skuItem});
        },
        removeSku(index: number) {
            this.skuValue.splice(index, 1)
        },
        handleSubmit() {
            // 是formData下的引用
            this.skus = this.skuValue.map((v:any, i: number) => {
                return {
                    ...v,
                    type_1_name: this.skuName[0].value || "",
                    type_2_name: this.skuName[1].value || "",
                    type_3_name: this.skuName[2].value || "",
                }
            })

            this.handleGoodsCreate();
        },
        async handleUploadImage(
            file:File, 
            Editor: Editor, 
            cursorLocation: number, 
            resetUploader: Function
        ) {
            const result = await useUpload(file)
            if(Array.isArray(result)) {
                const url =  request.defaults.baseURL + result[0].url;
                Editor.insertEmbed(cursorLocation, "image", url);
                resetUploader();
            }
        }
    }
});
</script>