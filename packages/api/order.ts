import generatorService from "../utils/generatorService";
import { ApiRequestConfig as Api } from "../utils/http/types"
import { OrderTypes } from "./types/orderTypes";

const getOrders: Api<OrderTypes.GetOrders> = {
    url: "/orders",
    method: "GET",
    token: true
}

const getOrdersCount: Api<OrderTypes.GetOrders> = {
    url: "/orders/count",
    method: "GET",
    token: true
}

const getOrderById: Api<{}> = {
    url: "/orders/:id",
    method: "GET",
    token: true
}

const getOrderTypes: Api<{}> = {
    url: "/order-types",
    method: "GET",
    token: true,
}

const updateOrder: Api<OrderTypes.Order> = {
    url: "/orders/:id",
    method: "PUT",
    token: true,
}

export default generatorService({
    getOrders,
    getOrdersCount,
    getOrderById,
    getOrderTypes,
    updateOrder
});