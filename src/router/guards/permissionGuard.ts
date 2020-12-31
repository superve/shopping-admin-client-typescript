import { Router } from "vue-router";
import { getToken } from "../../../packages/utils/storage";

const HOME_PATH = "/";

/**
 * 根据 permission 判断用户访问权限
 */
function permissionGuard(router: Router) {
    // pass
}

export default permissionGuard;