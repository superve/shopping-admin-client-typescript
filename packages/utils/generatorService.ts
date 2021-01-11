import request from "./http/request";
import * as _ from "lodash";

import { getToken } from "./storage";
import { ApiConfig, ApiRequestConfig, ApiResponsePromise  } from "./http/types";

// 可ctrl+点击AxiosRequestConfig 查看具体属性列表。
type ApiResult = Record<
    string, 
    (params?: Object, newArgs?: object) => ApiResponsePromise
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
        // params是请求的参数，可能是get或者post请求
        // newArgs 是覆盖原配置的对象
        apiResult[name] = function (params, newArgs ): ApiResponsePromise { 

            let current: ApiRequestConfig<{}> = config[name];
            if (_.isPlainObject(newArgs)) {
                current = Object.assign({}, current, newArgs);
            }
            // saveCurrent.params或saveCurrent.data出现缓存
            const saveCurrent = {...current};

            // 上传资源
            if(params instanceof FormData) {
                saveCurrent.data = params;
            } else {
                if (_.isPlainObject(params) === false) {
                    params = {};
                }
    
                // 合并参数
                if (current.method === "GET") {
                    saveCurrent.params = Object.assign(
                        {},
                        current.params || {},
                        params
                    )
                }else if (current.method === "POST" || current.method === "PUT") {
                    saveCurrent.data = Object.assign(
                        {},
                        current.data || {},
                        params
                    )
                }
            } 

            // 是否需要包含token
            if (saveCurrent.token) {
                delete saveCurrent.token;
                saveCurrent.headers = {
                    ...saveCurrent.headers,
                    Authorization: getToken()
                }
            }
            return request(saveCurrent);
        }
    });
    return apiResult;
}

export default generatorService;