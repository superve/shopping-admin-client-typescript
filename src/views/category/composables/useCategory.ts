import { onMounted, ref, unref, watch } from "vue";
import categoryApi from "../../../../packages/api/category";
import { CategoryTypes } from "../../../../packages/api/types/categoryTypes";

export default function useCategory() {
    const categories = ref<Array<any>>([]); 
    const queries = ref<CategoryTypes.GetCategory>({
        level: 1,
        _start: 0,
        _limit: 99, // 不分页了
    });

    async function fetchCategories() {
        const _queries = unref(queries);
        const result = await categoryApi.getCategories(_queries);
        if(Array.isArray(result)) {
            categories.value = result;
        }
    }

    async function editCategory(item: CategoryTypes.Category) {
        const result = await categoryApi.editCategory(item, {
            url: "/categories/" + item.id,
        });
        return Promise.resolve(result);
    }

    async function createCategory(item: CategoryTypes.Category) {
        const result = await categoryApi.createCategory(item);
        return result;
    }

    async function deleteCategory(item: CategoryTypes.Category) {
        const result = await categoryApi.deleteCategory(item, {
            url: "/categories/" + item.id
        });
        return result;
    }

    onMounted(fetchCategories);
    watch(queries, () => fetchCategories(), {deep: true});
      
    return {
        queries,
        categories,
        fetchCategories,
        editCategory,
        createCategory,
        deleteCategory
    }
}