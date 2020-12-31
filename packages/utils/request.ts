import { ComponentOptions } from "vue";
import axios from "axios";

import { ApiRequestConfig, ApiResponseError, ApiResponse } from "../types/apiTypes"

// 创建axios实例
const request = axios.create({
    // 请求API的路径
    baseURL: process.env.BASE_URL || "http://localhost:1337"
});

// 请求拦截器
request.interceptors.request.use((config: ApiRequestConfig<{}>) => {
    return config;
});

// 错误处理
type ErrorHandler = (error: ApiResponseError) => void;
const errorHandlers: Array<ErrorHandler> = [];

export const errorHandler = (callback?: ErrorHandler) => {
    if( typeof callback === "function" ) {
        errorHandlers.push(callback)
    }
    return (error: ApiResponseError) => {
        errorHandlers.forEach(handler => {
            handler(error);
        })

        return Promise.reject(error);
    }
};

// 响应拦截器
request.interceptors.response.use((response: ApiResponse) => {
    return response.data;
}, errorHandler());

// 作为插件暴露
export const VueAxios = {
    install (Vue: ComponentOptions) {
        Vue.prototype.$axios = request;
    }
}

// 默认暴露出request
export default request;
