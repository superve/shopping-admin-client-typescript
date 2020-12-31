import { ComponentOptions } from "vue";
import { errorHandler } from "../packages/utils/request";
import { ApiResponseError } from "../packages/types/apiTypes";
import router from "./router/index"
import { message } from "ant-design-vue";
import { removeStorage } from "../packages/utils/storage";

// 错误处理
function resErrorHandler() {
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

const setup = {
    install (app: ComponentOptions) {
        resErrorHandler();
    }
};

export default setup;