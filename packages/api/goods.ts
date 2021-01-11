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

const createGoods: Api<GoodsTypes.CreateGoods> = {
    url: "/admin/goods",
    method: "POST",
    token: true
}

export default generatorService({
    getGoods,
    getGoodsCount,
    createGoods
});