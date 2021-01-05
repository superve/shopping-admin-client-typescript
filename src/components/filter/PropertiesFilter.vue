<template>
    <div class="form">
        <a-form
            layout="inline"
            :model="formData"
            @submit="handleSubmit"
            @keyup.enter="handleSubmit"
        >
            <a-form-item v-for="(item, index) in formData" :key="index">
                    <a-select style="width: 40%" 
                    v-model:value="item.key" 
                    @select="handleSelect">
                        <a-select-option 
                        v-for="(subItem, subIndex) in filterKeys"
                        :key="subIndex"
                        :value="subItem.key"
                        :disabled="subItem.disabled">
                            {{ subItem.label }}
                        </a-select-option>
                    </a-select>
                    <a-input style="width: 60%" v-model:value="item.value" />
                    
            </a-form-item>
            <!-- 最多不能超过filterKeys的长度 -->
            <a-form-item v-show="filterKeys.length >= formData.length">
                <span class="extend-condition" @click="handleCondition">
                    <PlusCircleOutlined />
                </span>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit"> 搜索 </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { FilterKey, filterProps, FilterProps } from "./filterTypes";
import * as _ from "lodash";
import {
  PlusCircleOutlined
} from '@ant-design/icons-vue';

type formItemType = {
    key: string,
    value: string
}
type dataType = {
    formData: Array<formItemType>,
    query: Record<string, string>
}

export default defineComponent({
    setup(props: FilterProps) {
        const filterKeys = ref<FilterKey[]>([]);
        props.filterKeys && props.filterKeys.forEach(v => {
            filterKeys.value.push({
                ...v,
                disabled: false
            })
        });
        const setFilterKeys = (index: number, value: boolean) => {
            filterKeys.value[index].disabled = value;
        }
        return {
            filterKeys,
            setFilterKeys
        }
    },
    data() {
        return {
            formData: [
                {
                    key: "",
                    value: "",
                },
            ],
            query: {}
        } as dataType
    },
    props: filterProps(),
    components: {
        PlusCircleOutlined
    },
    methods: {
        handleSelect(value: string, item: any) {
            const formKeys = this.formData.map(v => v.key);
            this.filterKeys.forEach((v: FilterKey, index: number) => {
                // 排除掉第一个
                if(index === 0) return;

                if(formKeys.includes(v.key || "")) {
                    this.setFilterKeys(index, true);
                }else {
                    this.setFilterKeys(index, false);
                }   
            })
        },  
        handleSubmit(e: Event) {
            e.preventDefault();
            this.query = {};
            this.formData.forEach((item: formItemType) => {
                if(item.key && item.value) {
                    this.query[item.key] = item.value;
                }
            })
            //if(!_.isEmpty(this.query)) {
                this.$emit("search", this.query);
            //}
        },
        handleCondition() {
            this.formData.push({
                key: "",
                value: "",
            })
        }
    },
});
</script>

<style scoped lang="less">
.extend-condition {
    display: block;
    cursor: pointer;

    &:hover {
        color:  #1890ff;
    }
}
</style>