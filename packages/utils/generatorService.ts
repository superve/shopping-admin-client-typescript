import request from "./request";
import * as _ from "lodash";

import { getToken } from "./storage";
import { ApiConfig, ApiRequestConfig, ApiResponsePromise  } from "../types/apiTypes";

// 可ctrl+点击AxiosRequestConfig 查看具体属性列表。
type ApiResult = Record<
    string, 
    (params: Object) => ApiResponsePromise
>;

/**
 * 根据api配置自定生成请求api的方法供模块调用，可以在此过滤和统一api参数配置，如是否添加headers
 * 
 * @param {ApiConfig} config
 * @returns {Object} 
 */
function generatorService (config: ApiConfig) {
    const apiResult: ApiResult = {};
    Object.keys(config).forEach((name: string) => {
        // request 代理装饰器
        apiResult[name] = function (params: Object ): ApiResponsePromise { 
            if (_.isPlainObject(params) === false) {
                throw new Error("自定义错误：调用api参数必须是对象");
            }

            const args: ApiRequestConfig<{}> = config[name];
            // 禁止args.params或args.data出现缓存
            const saveArgs = {...args};

            if (args.method === "GET") {
                saveArgs.params = Object.assign(
                    {},
                    args.params || {},
                    params
                )
            }else if (args.method === "POST" || args.method === "PUT") {
                saveArgs.data = Object.assign(
                    {},
                    args.data || {},
                    params
                )
            }

            // 是否需要包含token
            if (saveArgs.token) {
                delete saveArgs.token;
                saveArgs.headers = {
                    ...saveArgs.headers,
                    Authorization: getToken()
                }
            }

            return request(saveArgs);
        }
    });
    return apiResult;
}

export default generatorService;