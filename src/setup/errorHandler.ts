import { errorHandler } from "../../packages/utils/http/request";
import { ApiResponseError } from "../../packages/utils/http/types";
import router from "../router/index"
import { removeStorage } from "../../packages/utils/storage";

// 独立放到hooks里
import { message } from "ant-design-vue";

// 错误处理
export default function resErrorHandler() {
    errorHandler((error: ApiResponseError) => {
        const { response } = error;
        
        if(response && response.status) {
            if(response.status === 401) {
                message.warn('用户信息验证失败，请重新登录。');
                // 删除本地信息
                removeStorage();
                // 跳转到登录页，并且清空store的用户数据
                router.push("/auth/login")
            }
        }
    })
}