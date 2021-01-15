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
                        <a-input v-model:value="item.value" 
                        :placeholder="item.placeholder">
                        </a-input>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item label="SKU值" :wrapper-col="{ span: 18}">
                <a-row :gutter="[16]" v-for="(item, index) in skuValue"
                    :key="index">
                    <a-col v-for="(subItem, key, subIndex) in item"
                    :key="subIndex">
                        <a-input v-model:value="item[key]" 
                        :placeholder="skuName[subIndex] && skuName[subIndex].value || skuPlaceholder[key]">
                        </a-input>
                    </a-col>
                    <a-col>
                        <a-button @click="removeSku(index)">删除</a-button>
                    </a-col>
                </a-row>
                <a-row :gutter="[16]">
                    <a-col><a-button size="small" @click="addSku">新增</a-button></a-col>
                    <a-col><a-button type="primary" size="small" @click="handleSubmitSku">确定</a-button></a-col>
                </a-row>
            </a-form-item>
            <a-form-item label="状态" name="is_sale">
                <a-switch :checked="formData.is_sale" @change="onIsSale" />
            </a-form-item>
            <a-form-item label="详情"  :wrapper-col="{ span: 20}">
                <RichEditor 
                v-model:value="formData.description" 
                @uploadImage="handleEditorUpload"/>
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
import { defineComponent, onMounted, watch, createVNode } from "vue";
import * as _ from "lodash";
import useGoodsCreate from "./composables/useGoodsCreate";
import useGoods from "./composables/useGoods";
import useGoodsSku from "./composables/useGoodsSku";
import usePreview from "./composables/usePreview";
import useUpload from "./composables/useUpload";
import getBase64 from "../../../packages/utils/getBase64";
import request from "../../../packages/utils/http/request";
import { getToken } from "../../../packages/utils/storage";

import RichEditor from "../../components/richEditor/Index";
import { Editor } from "../../components/richEditor/types";
import { useRoute } from "vue-router";

import useConfirm from "../../hooks/components/useConfirm";
import { GoodsTypes } from "../../../packages/api/types/goodsTypes";

enum CumstomAction {
    UPDATE = "update",
    CREATE = "create"
}

const skuItem: GoodsTypes.GoodsSku = {
    type_1: "",
    type_2: "",
    type_3: "",
    // type_1_name: "",
    // type_2_name: "",
    // type_3_name: "",
    price: "",
    inventory: "",
    sales_volume: "",
}

const skuPlaceholder = {
    type_1: "类型一",
    type_2: "类型二",
    type_3: "类型三",
    price: "单价",
    inventory: "库存",
    sales_volume: "销量"
}

export default defineComponent({
    setup() {
        let { 
            formData, 
            goods_media, 
            rules, 
            formRef,
            handleUpdateGoods
        } = useGoodsCreate();
        const {
            previewVisible, 
            previewImage, 
            handlePreview, 
            handleCancelPreview
        } =  usePreview();
        const { 
            goodsItem, 
            fetchGoodsById 
        } = useGoods();
        const {
            composeGoodsSku,
        } = useGoodsSku();
        const route = useRoute()
        onMounted(() => {
            fetchGoodsById(route.params.id);
        });

        return {
            formData,
            goods_media,
            rules,
            formRef,
            handleUpdateGoods,
            token: getToken(),

            previewVisible, 
            previewImage, 
            handlePreview, 
            handleCancelPreview,

            goodsItem, 
            composeGoodsSku,
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
            skuValue: [skuItem], // 用于类型推导
            skuItem,
            skuPlaceholder
        }
    },
    watch: {
        goodsItem(value){
            // 初始化formData
            this.formData.id = value.id;
            this.formData.goods_name = value.goods_name;
            // a-form为空校验时要求输入框值是string类型
            this.formData.purchasing_price = String(value.purchasing_price);
            this.formData.sales_price = String(value.sales_price);
            this.formData.inventory = String(value.inventory);
            this.formData.sales_inventory = String(value.sales_inventory);
            this.formData.goods_media = value.goods_media;
            this.formData.description = value.description;
            this.formData.is_sale = value.is_sale;
            this.formData.saled_at = value.saled_at;
            this.formData.skus = value.skus;

            // 初始化图片列表
            this.fileList = value.goods_media.map((v: any) => {
                return {
                    ...v,
                    url: request.defaults.baseURL + v.url
                }
            });

            // 初始化SKU名
            if(Array.isArray(value.skus) && value.skus.length) {
                this.skuName[0].value =  value.skus[0].type_1_name;
                this.skuName[1].value =  value.skus[0].type_2_name;
                this.skuName[2].value =  value.skus[0].type_3_name;

                this.skuValue = value.skus.map((v: any) => {
                    // pick会根据属性排序
                    return _.pick(
                        v, 
                        'type_1', 
                        'type_2', 
                        'type_3', 
                        'price', 
                        'inventory', 
                        'sales_volume'
                    )
                })
            }
        },
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
                // 这里注意创建和编辑是有区别的
                this.goods_media = fileList.map((v:any) => {
                    if(v.response && Array.isArray(v.response)) {
                        return v.response[0];
                    }else {
                        return v;
                    }
                });
            }         
        },
        addSku() {
            this.skuValue.push({...skuItem});
        },
        removeSku(index: number) {
            this.skuValue.splice(index, 1)
        },
        async handleEditorUpload(
            file:File, 
            Editor: Editor, 
            cursorLocation: number, 
            resetUploader: Function
        ) {
            const result = await useUpload(file)
            if(Array.isArray(result)) {
                const url = request.defaults.baseURL + result[0].url;
                Editor.insertEmbed(cursorLocation, "image", url);
                resetUploader();
            }
        },
        handleSubmitSku(){
            // 编辑部分
            const len = this.formData.skus.length;
            let editorSkus: Array<GoodsTypes.GoodsSku> = [];
            let createSkus: Array<GoodsTypes.GoodsSku> = [];
            let typeName = {
                type_1_name: this.skuName[0].value || "",
                type_2_name: this.skuName[1].value || "",
                type_3_name: this.skuName[2].value || "",
            }

            // 修改所有skus的名字
            this.skuValue.forEach((v:any, i: number) => {
                if(i < len) {
                    editorSkus.push({
                        ...v,
                        ...typeName,
                        id: this.formData.skus[i].id,
                    })
                }else {
                    createSkus.push({
                        goods: this.goodsItem.id,
                        ...v,
                        ...typeName,
                    })
                }
            })
            this.composeGoodsSku(editorSkus, createSkus);
        },
        handleSubmit() {
            // 是formData下的引用
            // this.skus = this.skuValue.map((v:any, i: number) => {
            //     return {
            //         ...v,
            //         type_1_name: this.skuName[0].value || "",
            //         type_2_name: this.skuName[1].value || "",
            //         type_3_name: this.skuName[2].value || "",
            //     }
            // })

            this.handleUpdateGoods();
        },
    }
});
</script>
