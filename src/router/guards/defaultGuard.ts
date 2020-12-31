import user from "packages/api/user";
import { Router } from "vue-router";
import { getToken, getUserInfo } from "../../../packages/utils/storage";

const LOGIN_PATH = "/auth/login";
const HOME_PATH = "/";

function defaultGuard(router: Router) {
    const token = getToken();
    const userInfo = getUserInfo();
    const hasUserInfo = !!token && !!userInfo.email;
    
    router.beforeEach((to, from, next) => {
        // 有token属登录状态，跳过登录页
        if(hasUserInfo && to.path === LOGIN_PATH) {
            next(HOME_PATH);
            return;
        }

        if(!hasUserInfo && to.path !== LOGIN_PATH) {
            next(LOGIN_PATH);
            return;;
        }

        next();
    })
}

export default defaultGuard;