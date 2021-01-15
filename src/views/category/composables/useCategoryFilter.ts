import {ref, Ref, unref} from "vue";
import { CategoryTypes } from "../../../../packages/api/types/categoryTypes";

export default function useGoodsFilter(queries: Ref<CategoryTypes.GetCategory>) {
    const filterKeys = ref([
        { key: "", label: "请选择" },
        { key: "id", label: "id" },
        { key: "category_name", label: "栏目名" }
    ]);
    
    function handleCategoryFilter(query: Record<string, any>) {
        const queryContains: Record<string, any> = {};
        Object.keys(query).forEach((v: string)=> {
            queryContains[v + "_contains"] = query[v];
        });
        queries.value = {
            level: unref(queries).level,
            _start: unref(queries)._start,
            _limit: unref(queries)._limit,
            ...queryContains
        }
    }

    return {
        filterKeys,
        handleCategoryFilter
    }
}