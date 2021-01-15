import generatorService from "../utils/generatorService";
import { ApiRequestConfig as Api } from "../utils/http/types"
import { CategoryTypes } from "./types/categoryTypes";

const getCategories: Api<CategoryTypes.GetCategory> = {
    url: "/categories",
    method: "GET",
    token: true
}

const editCategory: Api<CategoryTypes.Category> = {
    url: "/categories/:id",
    method: "PUT",
    token: true
}

const createCategory: Api<CategoryTypes.Category> = {
    url: "/categories",
    method: "POST",
    token: true
}

const deleteCategory: Api<{}> = {
    url: "/categories/:id",
    method: "DELETE",
    token: true
}

export default generatorService({
    getCategories,
    editCategory,
    createCategory,
    deleteCategory
});