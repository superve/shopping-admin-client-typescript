import generatorService from "../utils/generatorService";
import { ApiRequestConfig as Api } from "../utils/http/types"

// 新增管理员
const getAdminRoles: Api<{}>  = {
    url: "/admin/roles",
    method: "GET",
    token: true
}

export default generatorService({
    getAdminRoles
});