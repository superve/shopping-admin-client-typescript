<template>
    <div>
        <PropertiesFilter :filterKeys="filterKeys" @search="handleCategoryFilter">
            <a-form-item>
                <a-button type="primary" @click="handleChildModal({})">添加</a-button>
            </a-form-item>
        </PropertiesFilter>
        <a-table
            :columns="columns"
            :data-source="categories"
            childrenColumnName="children_categories"
            rowKey="id"
            :pagination="false"
        >
            <template #status="{ record }">
               <a-tag :color="record.blocked ? 'green' : 'orange'">
                    {{record.blocked ? "启用" : "关闭"}}
                </a-tag>
            </template>
            <template #action="{ record }">
                <a href="javascript:;" @click="handleEditeModal(record)">编辑</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="handleChildModal(record)">添加子菜单</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="handleDelete(record)">删除</a>
            </template>
        </a-table>
        <Dialog title="编辑栏目" @yes="handleEditorOk">
            <div>
                <a-form :model="formData">
                    <a-form-item label="栏目名字" 
                    name="category_name" 
                    :wrapperCol="{ span: 18 }"
                    :rules="{
                        required: true,
                        message: '请输入栏目名字'
                    }">
                        <a-input v-model:value="formData.category_name"></a-input>
                    </a-form-item>
                </a-form>
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useCategory from "./composables/useCategory";
import useModal from "../../hooks/components/useModal";
import useMessage from "../../hooks/components/useMessage";
import useConfirm from "../../hooks/components/useConfirm";

import useGoodsFilter from "./composables/useCategoryFilter";
import PropertiesFilter from "../../components/propertiesFilter/index.vue"

const { success } = useMessage();
const { useWarnConfirm } = useConfirm();
const ModelDialog = useModal(); // 编辑弹窗
// const ModelDialog2 = useModal(); // 编辑弹窗

const columns = [
    {
        title: "栏目名称",
        dataIndex: "category_name",
        key: "category_name",
    },
    {
        title: "状态",
        dataIndex: "blocked",
        key: "blocked",
        slots: { customRender: "status" },
    },
    {
        title: "操作",
        slots: { customRender: "action" },
    },
];

enum Status {
    EDIT = "edit",
    CREATE = "create"
}

export default defineComponent({
    setup() {
        const { 
            queries,
            categories, 
            editCategory, 
            createCategory,
            deleteCategory,
            fetchCategories
        } = useCategory();
        const {
            filterKeys,
            handleCategoryFilter
        } = useGoodsFilter(queries);

        return {
            queries,
            categories,
            editCategory,
            createCategory,
            deleteCategory,
            fetchCategories,

            filterKeys,
            handleCategoryFilter
        };
    },
    data() {
        return {
            status: Status.EDIT, // enum create | edit
            columns,
            formData: {}
        };
    },
    components: {
        Dialog: ModelDialog.Dialog,
        PropertiesFilter
    },
    methods: {
        handleEditeModal(item: Record<string, any>) {
            this.formData = item;
            this.status = Status.EDIT;
            ModelDialog.triggerVisible();
        },
        async handleEditorOk() {
            try {
                if(this.status === Status.EDIT) {
                    await this.editCategory(this.formData);
                }    

                if(this.status === Status.CREATE) {
                    await this.createCategory(this.formData);
                    await this.fetchCategories();
                }
            } catch (error) {}
  
            ModelDialog.triggerVisible();
            success("操作成功");
        },
        handleChildModal(item: Record<string, any>) {
            this.formData = {
                parent_category: item.id
            };
            this.status = Status.CREATE;
            ModelDialog.triggerVisible();
        },
        handleDelete(item: Record<string, any>) {
            useWarnConfirm("确定删除吗?").then(async () => {
                try {
                    await this.deleteCategory(item);
                    await this.fetchCategories();
                    success("操作成功");
                } catch (error) {}
            })
        }
    }
});
</script>

<style>
</style>