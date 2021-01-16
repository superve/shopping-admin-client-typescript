import generatorService from "../utils/generatorService";
import { ApiRequestConfig as Api } from "../utils/http/types"
import { PayTypes } from "./types/payTypes";

// 新增管理员
const payAlipayRefund: Api<PayTypes.Refund>  = {
    url: "/pays/alipay-refund",
    method: "GET",
    token: true
}

export default generatorService({
    payAlipayRefund
});