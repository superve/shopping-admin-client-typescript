import generatorService from "../utils/generatorService";
import { ApiRequestConfig as Api } from "../utils/http/types";
import { GoodsTypes } from "./types/goodsTypes";

const getGoods: Api<GoodsTypes.GetGoods> = {
    url: "/goods",
    method: "GET",
    token: true
}

const getGoodsCount: Api<GoodsTypes.GetGoods> = {
    url: "/goods/count",
    method: "GET",
    token: true
}

const createGoods: Api<GoodsTypes.Goods> = {
    url: "/admin/goods",
    method: "POST",
    token: true
}

const updateGoods: Api<GoodsTypes.Goods> = {
    url: "/goods/:id",
    method: "PUT",
    token: true
}

const getGoodsById: Api<object> = {
    url: "/goods/:id",
    method: "GET"
}

const delGoodsSku: Api<object> = {
    url: "/skus/:id",
    method: "DELETE"
}

const updateGoodsSku: Api<GoodsTypes.GoodsSku> = {
    url: "/skus/:id",
    method: "PUT",
    token: true
}

const createGoodsSku: Api<GoodsTypes.GoodsSku> = {
    url: "/skus",
    method: "POST",
    token: true
}

export default generatorService({
    getGoods,
    getGoodsCount,
    createGoods,
    getGoodsById,
    delGoodsSku,
    updateGoodsSku,
    createGoodsSku,
    updateGoods
});