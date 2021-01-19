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
                    :headers="{ Authorization: token }"
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
            <a-form-item label="栏目" name="categories">
                <a-cascader
                    v-model:value="formData.categories"
                    :options="categories"
                    placeholder="请选择栏目"
                    :fieldNames="{
                        label: 'category_name',
                        value: 'id',
                        children: 'children_categories'
                    }"
                />
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
            <a-form-item label="SKU名" :wrapper-col="{ span: 14}" name="skus">
                <a-row :gutter="[16]">
                    <a-col v-for="(item, index) in skuName"
                    :key="index">
                        <a-input v-model:value="item.value" :placeholder="item.placeholder">
                        </a-input>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item label="SKU值" :wrapper-col="{ span: 20}" name="skus">
                <a-row :gutter="[16]" v-for="(item, index) in skuValue"
                    :key="index">
                    <template v-for="(subItem, key, subIndex) in item"
                    :key="subIndex">
                        <a-col v-if="key !== 'cover'">
                            <a-input v-model:value="item[key]" 
                            :placeholder="skuName[subIndex] && skuName[subIndex].value || skuPlaceholder[key]">
                            </a-input>
                        </a-col>
                    </template>
                    <a-col>
                        <a-upload
                            v-model:fileList="item.cover"
                            :action="request.defaults.baseURL + '/upload'"
                            :headers="{ Authorization: token }"
                            name="files"
                        >
                            <a-button> 上传图片 </a-button>
                        </a-upload>
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
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelPreview">
            <img alt="" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useGoodsCreate from "./composables/useGoodsCreate";
import usePreview from "./composables/usePreview";
import useUpload from "./composables/useUpload";
import useGoodsCate from "./composables/useGoodsCate";


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
    sales_volume: "",
    cover: []
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
        const {
            previewVisible, 
            previewImage, 
            handlePreview, 
            handleCancelPreview
        } =  usePreview();
        const {
            categories
        } = useGoodsCate();

        return {
            formData,
            goods_media,
            skus,
            rules,
            handleGoodsCreate,
            formRef,
            token: getToken(),

            previewVisible, 
            previewImage, 
            handlePreview, 
            handleCancelPreview,

            categories
        }
    },
    data() {
        return {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 },
            fileList: [],
            request,
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
            }
        }
    },
    components: {
        RichEditor
    },
    methods: {
        onIsSale(value: boolean) {
            this.formData.is_sale = value;
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
                const coverId = v.cover[0] ? v.cover[0].response[0].id : "";
                return {
                    ...v,
                    type_1_name: this.skuName[0].value || "",
                    type_2_name: this.skuName[1].value || "",
                    type_3_name: this.skuName[2].value || "",
                    cover: coverId
                }
            });
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