import { onMounted, ref, unref } from "vue";
import categoryApi from "../../../../packages/api/category";
import { CategoryTypes } from "../../../../packages/api/types/categoryTypes";

export default function useGoodsCate() {
    const categories = ref<any[]>([]);
    const queries = ref<CategoryTypes.GetCategory>({
        level: 1
    });

    async function fetchCategories() {
        const _queries = unref(queries);
        const result = await categoryApi.getCategories(_queries);
        if(Array.isArray(result)) {
            categories.value = result;
        }
    }   
    onMounted(fetchCategories);
    return {
        categories,
        fetchCategories
    }
}